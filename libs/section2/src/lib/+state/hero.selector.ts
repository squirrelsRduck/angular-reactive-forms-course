import { createFeatureSelector } from '@ngrx/store';

export const heroSelector = createFeatureSelector<Array<string>>('hero');
