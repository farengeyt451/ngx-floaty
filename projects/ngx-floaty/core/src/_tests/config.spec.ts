import { TestBed } from '@angular/core/testing';

import { FLOATY_CONFIG, FloatyConfig, provideFloaty } from '../config';

describe('provideFloaty', () => {
  it('provides an empty config by default', () => {
    expect(TestBed.inject(FLOATY_CONFIG)).toEqual({});
  });

  it('provides the given config', () => {
    const mockConfig: FloatyConfig = { placement: 'right-start' };
    TestBed.configureTestingModule({ providers: [provideFloaty(mockConfig)] });

    expect(TestBed.inject(FLOATY_CONFIG)).toEqual(mockConfig);
  });
});
