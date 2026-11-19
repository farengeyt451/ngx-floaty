import { TestBed } from '@angular/core/testing';

import { FLOATY_CONFIG, provideFloaty } from './config';

describe('provideFloaty', () => {
  it('provides an empty config by default', () => {
    expect(TestBed.inject(FLOATY_CONFIG)).toEqual({});
  });

  it('provides the given config', () => {
    TestBed.configureTestingModule({ providers: [provideFloaty({ placement: 'right' })] });

    expect(TestBed.inject(FLOATY_CONFIG)).toEqual({ placement: 'right' });
  });
});
