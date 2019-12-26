import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'forms-course-simple-built-in-validators',
  templateUrl: './simple-built-in-validators.component.html',
  styleUrls: ['./simple-built-in-validators.component.css']
})
export class SimpleBuiltInValidatorsComponent implements OnInit {
  control = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.email
  ]);
  constructor() { }

  ngOnInit() {
  }

}
