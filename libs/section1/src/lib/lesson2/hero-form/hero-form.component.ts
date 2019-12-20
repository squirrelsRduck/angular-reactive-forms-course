import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export interface Hero {
  name: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    health: number;
  };
}

@Component({
  selector: 'forms-course-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.css']
})
export class HeroFormComponent {
  form = new FormGroup({
    name: new FormControl(''),
    stats: new FormGroup({
      attack: new FormControl(0),
      defense: new FormControl(0),
      speed: new FormControl(0),
      health: new FormControl(0)
    })
  });
  constructor() {}
}
