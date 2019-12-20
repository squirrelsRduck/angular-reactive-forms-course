import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'forms-course-simple-dynamic-array',
  templateUrl: './simple-dynamic-array.component.html',
  styleUrls: ['./simple-dynamic-array.component.css']
})
export class SimpleDynamicArrayComponent implements OnInit {
  form = new FormArray([
    new FormControl('hello'),
    new FormControl('world')
  ]);
  constructor() {}

  ngOnInit() {}

  addControl() {
    this.form.push(new FormControl('im new'))
  }

  removeControl(index: number) {
    this.form.removeAt(index);
  }
}
