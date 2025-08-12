import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeDetail } from './theme-detail';

describe('ThemeDetail', () => {
  let component: ThemeDetail;
  let fixture: ComponentFixture<ThemeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
