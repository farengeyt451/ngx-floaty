import { Component, inject } from '@angular/core';
import { FLOATY_CONFIG } from 'ngx-floaty/core';
import { FloatyPopover } from 'ngx-floaty/popover';
import { FloatyTooltip } from 'ngx-floaty/tooltip';

@Component({
  selector: 'app-root',
  imports: [FloatyTooltip, FloatyPopover],
  template: `
    <button
      type="button"
      floatyTooltip="Tooltip content"
    >
      Tooltip
    </button>
    <button
      type="button"
      [floatyPopover]="popover"
    >
      Popover
    </button>
    <ng-template #popover>Popover content</ng-template>
    <p data-testid="placement">{{ config.placement }}</p>
  `,
})
export class App {
  protected readonly config = inject(FLOATY_CONFIG);
}
