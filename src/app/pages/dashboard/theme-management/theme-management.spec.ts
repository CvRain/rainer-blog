import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeManagement } from './theme-management';

describe('ThemeManagement', () => {
  let component: ThemeManagement;
  let fixture: ComponentFixture<ThemeManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
