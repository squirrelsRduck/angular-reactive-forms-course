import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { heroSelector } from '../../+state/hero.selector';
import { select, Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';
import { createHero } from '../../+state/hero.actions';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'forms-course-hero-adder',
  templateUrl: './hero-adder.component.html',
  styleUrls: ['./hero-adder.component.css']
})
export class HeroAdderComponent {
  form = new FormGroup({
    name: new FormControl(
      '',
      [Validators.required, Validators.maxLength(16)],
      [
        (control: FormControl) => this.store.pipe(
          select(heroSelector),
          map(heroNameArr => heroNameArr.includes(control.value as string) ? {
            nameAlreadyExists: true
          } : null),
          first()
        )
      ]
    )
  });

  constructor(private store: Store<any>, private _matSnackBar: MatSnackBar) {}

  addName() {
    const name = this.form.get('name').value;
    this.store.dispatch(createHero({ name }));
    this._matSnackBar.open(`${name} added to Heroes!`, undefined, {
      duration: 2000
    });
    this.form.reset();
  }
}
