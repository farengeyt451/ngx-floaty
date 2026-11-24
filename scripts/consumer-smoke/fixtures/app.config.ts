import { ApplicationConfig } from '@angular/core';
import { provideFloaty } from 'ngx-floaty';

export const appConfig: ApplicationConfig = {
  providers: [provideFloaty({ placement: 'top-start' })],
};
