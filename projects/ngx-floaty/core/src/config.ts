import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import type { Placement, Alignment } from '@floating-ui/dom';

export type FloatyPlacement = Placement;
export type FloatyAlignment = Alignment;

export interface FloatyConfig {
  alignment?: FloatyAlignment;
  placement?: FloatyPlacement;
}

export const FLOATY_CONFIG = new InjectionToken<FloatyConfig>('FLOATY_CONFIG', {
  factory: () => ({}),
});

export function provideFloaty(config: FloatyConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: FLOATY_CONFIG, useValue: config }]);
}
