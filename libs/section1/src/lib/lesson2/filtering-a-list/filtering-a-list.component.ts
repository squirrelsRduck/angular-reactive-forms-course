import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { startWith, takeUntil, tap } from 'rxjs/operators';

type Employee = 'Zack' | 'Jeff' | 'Victor';

interface Task {
  name: string;
  assignedTo: Employee | null;
}

interface FormValue {
  showOnlyUnassignedTickets: boolean;
  nameFilter: string;
}

const filterForUnassignedTickets = (
  task: Task,
  { showOnlyUnassignedTickets }: FormValue
): boolean => (showOnlyUnassignedTickets ? !task.assignedTo : true);

const filterByTaskName = (task: Task, { nameFilter }: FormValue): boolean =>
  nameFilter ? task.name.includes(nameFilter) : true;

@Component({
  selector: 'forms-course-filtering-a-list',
  templateUrl: './filtering-a-list.component.html',
  styleUrls: ['./filtering-a-list.component.css']
})
export class FilteringAListComponent implements OnInit, OnDestroy {
  private destroying$ = new Subject<void>();
  tasks: Task[] = [
    { name: 'Create forms course', assignedTo: 'Zack' },
    { name: 'Build file cabinets', assignedTo: 'Zack' },
    { name: 'Run all of Nrwl', assignedTo: 'Jeff' },
    { name: 'Create ground-breaking tech', assignedTo: 'Victor' },
    { name: 'make all the $$$', assignedTo: null }
  ];
  filteredTasks: Task[] = [];
  form = new FormGroup({
    showOnlyUnassignedTickets: new FormControl(false),
    nameFilter: new FormControl('s')
  });

  constructor() {
  }

  ngOnInit() {
    this.form.valueChanges.pipe(
      takeUntil(this.destroying$),
      startWith(this.form.value),
      tap((formValue: FormValue) => this.filteredTasks = this.tasks
        .filter((t) => filterForUnassignedTickets(t, formValue))
        .filter((t) => filterByTaskName(t, formValue)))
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroying$.next();
  }
}
