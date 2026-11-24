import { TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FloatyPopover } from 'ngx-floaty/popover';
import { FloatyTooltip } from 'ngx-floaty/tooltip';

import { App } from './app';
import { appConfig } from './app.config';

describe('ngx-floaty in a fresh Angular app', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
  });

  it('renders the library directives with the provided config', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const tooltip = fixture.debugElement.query(By.directive(FloatyTooltip)).injector.get(FloatyTooltip);
    const popover = fixture.debugElement.query(By.directive(FloatyPopover)).injector.get(FloatyPopover);
    const placement = fixture.nativeElement.querySelector('[data-testid="placement"]');

    expect(tooltip.floatyTooltip()).toBe('Tooltip content');
    expect(popover.floatyPopover()).toBeInstanceOf(TemplateRef);
    expect(placement.textContent).toBe('top-start');
  });
});
