import { Directive, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[floatyPopover]',
})
export class FloatyPopover {
  readonly floatyPopover = input.required<string | TemplateRef<unknown>>();
}
