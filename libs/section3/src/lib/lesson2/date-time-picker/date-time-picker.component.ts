import { Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor, FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';

const padZero = (n: number): string => (n < 10 ? `0${n}` : `${n}`);
const timeString = (date: Date) =>
  `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(
    date.getSeconds()
  )}`;
const dateString = (date: Date) =>
  `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
    date.getDate()
  )}`;

@Component({
  selector: 'forms-course-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateTimePickerComponent,
      multi: true
    }
  ]
})
export class DateTimePickerComponent
  implements OnDestroy, ControlValueAccessor {
  formGroup: FormGroup;
  private _destroying$ = new Subject<void>();
  private _onTouched;

  writeValue(date: Date) {
    if(this.formGroup) {
      this.formGroup.setValue({
        date: dateString(date),
        time: timeString(date)
      })
    } else {
      this.formGroup = new FormGroup({
        date: new FormControl(dateString(date)),
        time: new FormControl(timeString(date))
      })
    }
  }

  registerOnChange(fn) {
    this.formGroup.valueChanges.pipe(
      startWith(this.formGroup.value),
      takeUntil(this._destroying$),
      map(({date, time}) =>
        date && time ? new Date(`${date} ${time}`): null),
      tap(fn)
    ).subscribe()
  }

  registerOnTouched(fn) {
    // create your implementation here!
  }

  blur() {
    // create your implementation here!
  }

  setDisabledState(isDisabled: boolean) {
    isDisabled ? this.formGroup.disable(): this.formGroup.enable();
  }

  ngOnDestroy() {
    this._destroying$.next();
  }
}
