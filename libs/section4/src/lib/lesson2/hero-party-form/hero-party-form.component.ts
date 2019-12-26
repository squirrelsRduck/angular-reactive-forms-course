import { Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subject } from 'rxjs';
import { createPartyFormGroup, Party } from '../../hero-party-utils';
import { startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'forms-course-hero-party-form',
  templateUrl: './hero-party-form.component.html',
  styleUrls: ['./hero-party-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: HeroPartyFormComponent,
      multi: true
    }
  ]
})
export class HeroPartyFormComponent implements OnDestroy, ControlValueAccessor {
  private _destroying$ = new Subject<void>();
  form: FormGroup;
  validPartySizes = [1, 2, 3, 4, 5, 6];

  writeValue(party: Party) {
    if(this.form) {
      this.form.setValue(party);
    } else {
      this.form = createPartyFormGroup(party, this._destroying$);
    }
  }

  registerOnChange(fn) {
    this.form.valueChanges.pipe(
      startWith(this.form.value),
      takeUntil(this._destroying$),
      tap(fn)
    ).subscribe();
  }

  registerOnTouched(fn) {}

  setDisabledState(disable: boolean) {
    disable ? this.form.disable() : this.form.enable();
  }

  ngOnDestroy() {
    this._destroying$.next();
  }
}
