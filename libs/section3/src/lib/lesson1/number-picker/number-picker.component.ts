import { Component, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButton } from '@angular/material';

@Component({
  selector: 'forms-course-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberPickerComponent,
      multi: true
    }
  ]
})
export class NumberPickerComponent implements ControlValueAccessor {
  value: number;
  private _onChange;
  private _onTouched;
  @ViewChild('subtract', { static: true }) subtract: MatButton;
  @ViewChild('add', { static: true }) add: MatButton;
  @ViewChild('display', { static: true }) display: ElementRef;

  subtractOne() {
    this.value --;
    this._onChange(this.value);
  }

  addOne() {
    this.value ++;
    this._onChange(this.value);
  }

  writeValue(v: number) {
    this.value = v;
  }

  registerOnChange(fn) {
    this._onChange = fn;
  }

  registerOnTouched(fn) {
    this._onTouched = fn;
  }

  blur() {
    setTimeout(() => {
      const vcNativeElements = [this.display, this.add, this.subtract]
        .map((e: any) => {
          debugger;
          return e.nativeElement || e._elementRef.nativeElement;
        });
      if(!vcNativeElements.includes(document.activeElement)) {
        console.info('in blue', document.activeElement)
        this._onTouched();
      }
    });
  }
}
