import { Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor, FormArray,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subject } from 'rxjs';
import {
  createFamilyTreeControl,
  createFamilyTreeGroup,
  FamilyTreeModel,
  updateFamilyTreeFormGroup
} from '../../family-tree.utils';
import { startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'forms-course-family-tree-form',
  templateUrl: './family-tree-form.component.html',
  styleUrls: ['./family-tree-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FamilyTreeFormComponent,
      multi: true
    }
  ]
})
export class FamilyTreeFormComponent
  implements OnDestroy, ControlValueAccessor {
  form: FormGroup;
  private _destroying$ = new Subject<void>();

  writeValue(v: FamilyTreeModel) {
    if(this.form) {
      updateFamilyTreeFormGroup(this.form, v);
    } else {
      this.form = createFamilyTreeGroup(v);
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

  addChild() {
    (this.form.get('children') as FormArray).push(
      createFamilyTreeControl({
        name: '',
        age: 0,
        children: []
      })
    )
  }

  ngOnDestroy() {
    this._destroying$.next();
  }
}
