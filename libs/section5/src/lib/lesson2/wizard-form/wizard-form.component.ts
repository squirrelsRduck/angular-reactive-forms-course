import { Component, Input, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subject } from 'rxjs';
import { configSettingInfo, ConfigSettings } from '../../+state';
import { createWizardFormGroup } from '../../wizard-form.utils';
import { startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'forms-course-wizard-form',
  templateUrl: './wizard-form.component.html',
  styleUrls: ['./wizard-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: WizardFormComponent,
      multi: true
    }
  ]
})
export class WizardFormComponent implements OnDestroy, ControlValueAccessor {
  @Input() storeValue: ConfigSettings;
  form: FormGroup;
  _destroying$ = new Subject<void>();
  generalSettings = configSettingInfo.filter(
    settingInfo => settingInfo.category === 'General'
  );
  advancedSettings = configSettingInfo.filter(
    settingInfo => settingInfo.category === 'Advanced'
  );
  adminSettings = configSettingInfo.filter(
    settingInfo => settingInfo.category === 'Admin'
  );

  writeValue(v: ConfigSettings) {
    if (this.form) {
      this.form.setValue(v);
    } else {
      this.form = createWizardFormGroup(v);
    }
  }

  registerOnChange(fn) {
    this.form.valueChanges.pipe(
      startWith(this.form.value),
      takeUntil(this._destroying$),
      tap(fn)
    ).subscribe()
  }

  registerOnTouched(fn) {}

  setDisabledState(isDisabled: boolean) {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  ngOnDestroy() {
    this._destroying$.next();
  }
}
