import { Component, OnInit, ViewChild } from '@angular/core';
import { HeroGridComponent } from '../../lesson1/hero-grid/hero-grid.component';
import { FormControl } from '@angular/forms';
import {
  defaultTableFormValue,
  Hero,
  sortHeroes,
  heroGlobalFilter,
  heroColumnFilter,
  heroesOnPage
} from '../../+state/hero.utils';
import { Sort } from '@angular/material';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  startWith,
  map,
  switchMap,
  shareReplay,
  share,
  debounceTime, pluck
} from 'rxjs/operators';
import { heroSelector } from '../../+state/hero.selector';

@Component({
  selector: 'forms-course-client-side-table',
  templateUrl: './client-side-table.component.html',
  styleUrls: ['./client-side-table.component.css']
})
export class ClientSideTableComponent implements OnInit {
  @ViewChild(HeroGridComponent, { static: true })
  heroGridComponent: HeroGridComponent;
  tableForm = new FormControl(defaultTableFormValue);
  columnFilterForm = new FormControl({
    name: '',
    attack: '',
    defense: '',
    speed: '',
    health: ''
  });
  sortInstructions$: Observable<Sort>;
  allHeroes: Observable<Hero[]>;
  filteredHeroes: Observable<Hero[]>;
  totalItems$: Observable<number>;
  heroesOnPage$: Observable<Hero[]>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    setTimeout(() => {
      this.sortInstructions$ = this.heroGridComponent.sort.pipe(
        startWith(null)
      );
      this.allHeroes = this.store.pipe(
        select(heroSelector),
        switchMap(h => this.sortInstructions$.pipe(
          map(si => sortHeroes(h, si))
        )),
        shareReplay(1)
      )
      this.filteredHeroes = this.tableForm.valueChanges.pipe(
        startWith({filter: this.tableForm.value.filter}),
        pluck('filter'),
        switchMap(filter => this.columnFilterForm.valueChanges.pipe(
          startWith(this.columnFilterForm.value),
          map(colFilters => ({globalFilter: filter, ...colFilters}))
        )),
        switchMap(({globalFilter, columnFilters}) => this.allHeroes.pipe(
          map(allHeroes => allHeroes.filter(hero => heroGlobalFilter(hero, globalFilter))
                                            .filter(hero => heroColumnFilter(hero, columnFilters)))
        )),
        shareReplay(1)
      );
      this.totalItems$ = this.filteredHeroes.pipe(
       debounceTime(0),
       pluck('length')
      );
      this.heroesOnPage$ = this.filteredHeroes.pipe(
        switchMap(filteredHeroes => this.tableForm.valueChanges.pipe(
          startWith(this.tableForm.value),
          map(heroTableFormValue => heroesOnPage(filteredHeroes, heroTableFormValue))
        ))
      );
    }, 0);
  }
}
