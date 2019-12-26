import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Observable, ReplaySubject, Subject, combineLatest } from 'rxjs';
import { createNumberConfigSettingControl } from '../../config-settings.utils';
import { startWith, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'forms-course-number-config-setting-form',
  templateUrl: './number-config-setting-form.component.html',
  styleUrls: ['./number-config-setting-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberConfigSettingFormComponent,
      multi: true
    }
  ]
})
export class NumberConfigSettingFormComponent
  implements OnDestroy, ControlValueAccessor, OnChanges {
  @Input() name: string;
  @Input() storeValue: number;
  private _storeValue$ = new ReplaySubject<number>(1);
  formValueMatchesStoreValue$: Observable<boolean>;
  control: FormControl;
  _destroying$ = new Subject<void>();
  _onTouched;

  writeValue(v: number) {
    if(this.control) {
      this.control.setValue(v);
    } else {
      this.control = createNumberConfigSettingControl(v);
      this.formValueMatchesStoreValue$ = combineLatest([
        this.control.valueChanges.pipe(startWith(this.control.value)),
        this._storeValue$
      ]).pipe(
        map(([formVal, storeVal]) => formVal === storeVal)
      );
    }
  }

  registerOnChange(fn) {
    this.control.valueChanges.pipe(
      startWith(this.control.value),
      takeUntil(this._destroying$),
      tap(fn)
    ).subscribe();
  }

  registerOnTouched(fn) {
    this._onTouched = fn;
  }

  blur() {
    this._onTouched();
  }

  setDisabledState(isDisabled: boolean) {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.storeValue) {
      this._storeValue$.next(this.storeValue);
    }
  }

  ngOnDestroy() {
    this._destroying$.next();
  }
}
