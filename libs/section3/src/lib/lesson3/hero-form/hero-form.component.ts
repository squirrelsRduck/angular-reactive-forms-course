import { Component, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

interface Hero {
  name: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    health;
  };
}

const stats = ['attack', 'defense', 'speed', 'health'];

@Component({
  selector: 'forms-course-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: HeroFormComponent, multi: true }
  ]
})
export class HeroFormComponent implements OnDestroy, ControlValueAccessor {
  private _destroying$ = new Subject<void>();
  stats = stats;
  form: FormGroup;

  writeValue(hero: Hero) {
    if (this.form) {
      this.form.setValue(hero);
    } else {
      this.form = new FormGroup({
        name: new FormControl(hero.name),
        stats: new FormGroup(
          stats.reduce(
          (acc, statName) => ({
            ...acc,
            [statName]: new FormControl(hero.stats[statName])
          }), {}))
      });
    }
  }

  registerOnChange(fn) {
   this.form.valueChanges.pipe(
     takeUntil(this._destroying$),
     tap(fn)
   ).subscribe();
  }

  registerOnTouched(fn) {
    // add your implementation here!
  }

  blur() {
    // add your implementation here!
  }

  setDisabledState(isDisabled: boolean) {
    isDisabled ? this.form.disable(): this.form.enable();
  }

  ngOnDestroy() {
    this._destroying$.next();
  }
}
