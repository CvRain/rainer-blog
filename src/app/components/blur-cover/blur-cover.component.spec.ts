import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlurCoverComponent } from './blur-cover.component';

describe('BlurCoverComponent', () => {
  let component: BlurCoverComponent;
  let fixture: ComponentFixture<BlurCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlurCoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlurCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
