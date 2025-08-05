import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFooter } from './simple-footer';

describe('SimpleFooter', () => {
  let component: SimpleFooter;
  let fixture: ComponentFixture<SimpleFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
