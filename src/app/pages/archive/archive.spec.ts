import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Archive } from './archive';

describe('Archive', () => {
  let component: Archive;
  let fixture: ComponentFixture<Archive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Archive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Archive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
