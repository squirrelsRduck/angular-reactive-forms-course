import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { WizardComponent } from '../wizard/wizard.component';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDiscardChangesGuard
  implements CanDeactivate<WizardComponent> {
  canDeactivate(component: WizardComponent): Observable<boolean> {
    return component.canDeactivate()
      .pipe(
        first()
      );
  }
}
