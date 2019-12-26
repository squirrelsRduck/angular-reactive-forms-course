import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

interface Hero {
  name: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    health: number;
  };
}

const MIN_STAT_THRESHOLD = 0;
const MAX_STAT_THRESHOLD = 20;
const statValidators: ValidatorFn[] = [
  Validators.min(MIN_STAT_THRESHOLD),
  Validators.max(MAX_STAT_THRESHOLD)
];

@Component({
  selector: 'forms-course-hero-validation',
  templateUrl: './hero-validation.component.html',
  styleUrls: ['./hero-validation.component.css']
})
export class HeroValidationComponent implements OnInit {
  stats = ['attack', 'defense', 'speed', 'health'];
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    stats: new FormGroup({
      attack: new FormControl(0, statValidators),
      defense: new FormControl(0, statValidators),
      speed: new FormControl(0, statValidators),
      health: new FormControl(0, statValidators)
    })
  });
  constructor() {}

  ngOnInit() {}
}
