import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterManagement } from './chapter-management';

describe('ChapterManagement', () => {
  let component: ChapterManagement;
  let fixture: ComponentFixture<ChapterManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapterManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
