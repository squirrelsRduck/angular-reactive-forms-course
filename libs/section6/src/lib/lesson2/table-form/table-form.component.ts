import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor, FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { HeroTableFormValue } from '../../+state/hero.utils';
import { delay, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'forms-course-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TableFormComponent, multi: true }
  ]
})
export class TableFormComponent
  implements ControlValueAccessor, OnDestroy, OnChanges {
  @Input() totalItems: number;
  private _totalItems = new ReplaySubject<number>(1);
  form: FormGroup;
  private _destroying = new Subject<void>();
  totalPages$: Observable<number>;

  writeValue(v: HeroTableFormValue) {
    if(this.form) this.form.setValue(v);
    else {
      this.form = new FormGroup({
        filter: new FormControl(v.filter),
        columnFilters: new FormControl(v.columnFilters),
        pageSize: new FormControl(v.pageSize),
        currentPage: new FormControl(v.currentPage)
      });
      this.totalPages$ = this.form.get('pageSize').valueChanges.pipe(
        startWith(this.form.get('pageSize').value),
        switchMap(pageSize => this._totalItems.pipe(
          map(totalItems => Math.ceil(totalItems / pageSize))))
      );
    }
  }

  registerOnChange(fn) {
    this.form.valueChanges.pipe(
      delay(0),
      takeUntil(this._destroying),
      startWith(this.form.value),
      tap(fn)
    ).subscribe();
  }

  registerOnTouched() {}

  setDisabledState(isDisabled: boolean) {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.totalItems) {
      this._totalItems.next(this.totalItems);
    }
  }

  ngOnDestroy() {
    this._destroying.next();
  }
}
