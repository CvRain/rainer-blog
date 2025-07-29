import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfIntroCardComponent } from './self-intro-card.component';

describe('SelfIntroCardComponent', () => {
  let component: SelfIntroCardComponent;
  let fixture: ComponentFixture<SelfIntroCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfIntroCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfIntroCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
