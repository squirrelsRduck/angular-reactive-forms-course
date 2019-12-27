import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfigSettings, configSettingsSelector, savePendingSelector } from '../+state';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { delay, first, map, share, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { createConfigSettingFormControl } from '../wizard-form.utils';
import * as deepEqual from 'deep-equal';
import { CompletedDiscardChangesDialogComponent } from '../completed/completed-discard-changes-dialog/completed-discard-changes-dialog.component';

@Component({
  selector: 'forms-course-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnDestroy {
  control: FormControl;
  configSettingsFromStore$: Observable<ConfigSettings> = this.store.pipe(
    select(configSettingsSelector)
  );
  private _formHasChanges$: Observable<boolean>;
  private _formIsValid$: Observable<boolean>;
  private _destroying$ = new Subject<void>();
  submitButtonDisabled$: Observable<boolean>;
  discardChangesButtonDisabled$: Observable<boolean>;
  savePending$: Observable<boolean> = this.store.pipe(
    select(savePendingSelector)
  );

  constructor(private store: Store<any>, private dialog: MatDialog) {
    this.configSettingsFromStore$
      .pipe(
        takeUntil(this._destroying$),
        delay(0),
        tap(configSettings => {
          if (this.control) {
            this.control.setValue(configSettings);
          } else {
            this.control = createConfigSettingFormControl(configSettings);
            this.configPart2();
          }
        })
      )
      .subscribe();
  }

  configPart2() {
    this._formIsValid$ = this.control.statusChanges.pipe(
      startWith(this.control.status),
      map(status => status === 'VALID')
    );
    this._formHasChanges$ = combineLatest([
      this.control.valueChanges,
      this.configSettingsFromStore$
    ]).pipe(
      map(([formVal, storeVal]) => !deepEqual(formVal, storeVal)),
      shareReplay(1)
    );
    this.submitButtonDisabled$ = combineLatest([
      this._formIsValid$,
      this._formHasChanges$,
      this.savePending$
    ]).pipe(
      delay(0),
      map(
        ([formIsValid, formHasChanges, savePending]) =>
          !formIsValid || !formHasChanges || savePending
      )
    );
    this.discardChangesButtonDisabled$ = this._formHasChanges$.pipe(
      map(hasChanges => !hasChanges)
    );
    this.savePending$
      .pipe(
        takeUntil(this._destroying$),
        tap(savePending =>
          savePending ? this.control.disable() : this.control.enable()
        )
      )
      .subscribe();
  }

  confirmSave() {
    // add your implementation here in lesson 5
  }

  async discardChanges() {
    const configSettings = await this.configSettingsFromStore$.pipe(
      first()
    ).toPromise();
    this.control.setValue(configSettings);
  }

  canDeactivate(): Observable<boolean> {
    return this._formHasChanges$.pipe(
      switchMap(hasChanges => {
        if(hasChanges) {
          // open dialog, wait for user input
          const dialogRef = this.dialog
            .open(CompletedDiscardChangesDialogComponent);
          return dialogRef.afterClosed();
        } else {
          return of(true);
        }
      })
    )
  }

  ngOnDestroy() {
    this._destroying$.next();
  }
}
