import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFloaty } from './ngx-floaty';

describe('NgxFloaty', () => {
  let component: NgxFloaty;
  let fixture: ComponentFixture<NgxFloaty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxFloaty],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxFloaty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
