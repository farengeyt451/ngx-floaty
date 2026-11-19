import { Directive, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[floatyTooltip]',
})
export class FloatyTooltip {
  readonly floatyTooltip = input.required<string | TemplateRef<unknown>>();
}
