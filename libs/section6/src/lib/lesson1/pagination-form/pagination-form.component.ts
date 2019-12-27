import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

const createPaginationOptions = (
  currentPage: number,
  totalPages: number
): number[] => {
  const temp: number[] = [currentPage];
  let negativePointer = currentPage - 1;
  let positivePointer = currentPage + 1;
  while (
    temp.length < 5 &&
    (negativePointer > 0 || positivePointer <= totalPages)
  ) {
    if (negativePointer > 0) {
      temp.unshift(negativePointer);
    }
    if (positivePointer <= totalPages) {
      temp.push(positivePointer);
    }
    negativePointer--;
    positivePointer++;
  }
  return temp;
};

@Component({
  selector: 'forms-course-pagination-form',
  templateUrl: './pagination-form.component.html',
  styleUrls: ['./pagination-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PaginationFormComponent,
      multi: true
    }
  ]
})
export class PaginationFormComponent
  implements ControlValueAccessor, OnDestroy, OnChanges {
  @Input() totalPages = 1;
  private _totalPages$ = new ReplaySubject<number>(1);
  // TODO: figure out why this doesnt need an input decorator
  control: FormControl;
  private _destroying = new Subject<void>();
  public paginationOptions$: Observable<number[]>;
  public showFirst$: Observable<boolean>;
  public showFirstElipsis$: Observable<boolean>;
  public showLastElipsis$: Observable<boolean>;
  public showLast$: Observable<boolean>;

  writeValue(v: number) {
    if(this.control) this.control.setValue(v);
    else {
      this.control = new FormControl(v);
      this.paginationOptions$ = this.control.valueChanges.pipe(
        startWith(this.control.value),
        switchMap(fv => this._totalPages$.pipe(
          map(totalPages => createPaginationOptions(fv, totalPages))
        ))
      );

      this.control.valueChanges.pipe(
        startWith(this.control.value),
        switchMap(fv => this._totalPages$.pipe(
          tap(totalPages => {
            if(fv > totalPages) {
              this.control.setValue(totalPages);
            }
          })
        ))
      ).subscribe();
    }
  }

  private _setFirstAndLastObservables() {
    this.showFirst$ = this.paginationOptions$.pipe(
      map(options => options.length > 1 && !options.includes(1))
    );
    this.showFirstElipsis$ = this.paginationOptions$.pipe(
      map(options => options.length > 2 && !options.includes(2))
    );
    this.showLast$ = combineLatest([
      this.paginationOptions$,
      this._totalPages$
    ]).pipe(
      map(
        ([options, totalPages]) =>
          options.length > 1 && !options.includes(totalPages)
      )
    );
    this.showLastElipsis$ = combineLatest([
      this.paginationOptions$,
      this._totalPages$
    ]).pipe(
      map(
        ([options, totalPages]) =>
          options.length > 2 && !options.includes(totalPages - 1)
      )
    );
  }

  registerOnChange(fn) {
    this.control.valueChanges.pipe(
      takeUntil(this._destroying),
      startWith(this.control.value),
      tap(fn)
    ).subscribe();
  }

  registerOnTouched(fn) {}

  userClick(pageNumber: number) {
    this.control.setValue(pageNumber);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.totalPages) {
      this._totalPages$.next(this.totalPages);
    }
  }

  ngOnDestroy() {
    this._destroying.next();
  }
}
