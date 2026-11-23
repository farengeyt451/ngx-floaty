import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import type { Placement } from '@floating-ui/dom';

export type FloatyPlacement = Placement;

export interface FloatyConfig {
  placement?: FloatyPlacement;
}

export const FLOATY_CONFIG = new InjectionToken<FloatyConfig>('FLOATY_CONFIG', {
  factory: () => ({}),
});

export function provideFloaty(config: FloatyConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: FLOATY_CONFIG, useValue: config }]);
}
