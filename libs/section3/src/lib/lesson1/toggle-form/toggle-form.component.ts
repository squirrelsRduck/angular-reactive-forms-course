import { Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'forms-course-toggle-form',
  templateUrl: './toggle-form.component.html',
  styleUrls: ['./toggle-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ToggleFormComponent,
      multi: true
    }
  ]
})
export class ToggleFormComponent implements OnDestroy, ControlValueAccessor {
  control: FormControl;
  private _destroying = new Subject<void>();
  private _onTouched;

  writeValue(v: boolean) {
    if(this.control) {
      this.control.setValue(v);
    } else {
      this.control = new FormControl(v);
    }
  }

  registerOnChange(fn) {
    this.control.valueChanges.pipe(
      takeUntil(this._destroying),
      startWith(this.control.value),
      tap(v => fn(v))
    ).subscribe();
  }

  registerOnTouched(fn) {
    this._onTouched = fn;
  }

  ngOnDestroy() {
    this._destroying.next();
  }
}
