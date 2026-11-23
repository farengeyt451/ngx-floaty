import { TestBed } from '@angular/core/testing';

import { FLOATY_CONFIG, FloatyConfig, provideFloaty } from '../config';

describe('provideFloaty', () => {
  it('provides an empty config by default', () => {
    // Assert
    expect(TestBed.inject(FLOATY_CONFIG)).toEqual({});
  });

  it('provides the given config', () => {
    // Arrange
    const mockConfig: FloatyConfig = { alignment: 'start', placement: 'right' };

    // Act
    TestBed.configureTestingModule({ providers: [provideFloaty(mockConfig)] });

    // Assert
    expect(TestBed.inject(FLOATY_CONFIG)).toEqual(mockConfig);
  });
});
