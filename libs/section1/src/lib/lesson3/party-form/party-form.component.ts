import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hero } from '../../lesson2/completed/lesson2-completed-hero-form/lesson2-completed-hero-form.component';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { animations } from '@forms-course/ui-common';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export interface Party {
  name: string;
  partySize: number;
  heroes: Hero[];
}

const createHero = (): Hero => ({
  name: '',
  stats: {
    attack: 0,
    defense: 0,
    speed: 0,
    health: 0
  }
});

const createHeroForm = (hero?: Hero): FormGroup =>
  new FormGroup({
    name: new FormControl(hero ? hero.name : ''),
    stats: new FormGroup({
      attack: new FormControl(hero ? hero.stats.attack : 0),
      defense: new FormControl(hero ? hero.stats.defense : 0),
      speed: new FormControl(hero ? hero.stats.speed : 0),
      health: new FormControl(hero ? hero.stats.health : 0)
    })
  });

@Component({
  selector: 'forms-course-party-form',
  templateUrl: './party-form.component.html',
  styleUrls: ['./party-form.component.css'],
  animations
})
export class PartyFormComponent implements OnInit, OnDestroy {
  possiblePartySizes = [1, 2, 3, 4, 5, 6];
  private destroying$ = new Subject<void>();
  form = new FormGroup({
    name: new FormControl(''),
    partySize: new FormControl(2),
    heroes: new FormArray([createHeroForm(), createHeroForm()])
  });

  constructor() {
  }

  ngOnInit() {
    this.form
      .get('partySize')
      .valueChanges.pipe(
      takeUntil(this.destroying$),
      tap(newPartySize => {
        const currLen = (this.form.get('heroes') as FormArray).length;
        if (newPartySize > currLen) {
          for (let a=0; a < (newPartySize - currLen); a++) {
            (this.form.controls.heroes as FormArray).push(createHeroForm());
          }
        }
        if (newPartySize < currLen) {
          for (let a = 0; a < (currLen - newPartySize); a++) {
            (this.form.controls.heroes as FormArray).removeAt(0);
          }
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroying$.next();
  }
}
