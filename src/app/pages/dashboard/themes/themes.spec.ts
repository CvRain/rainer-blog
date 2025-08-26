import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Themes } from './themes';

describe('Themes', () => {
  let component: Themes;
  let fixture: ComponentFixture<Themes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Themes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Themes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
