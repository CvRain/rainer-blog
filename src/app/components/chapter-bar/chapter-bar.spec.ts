import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterBar } from './chapter-bar';

describe('ChapterBar', () => {
  let component: ChapterBar;
  let fixture: ComponentFixture<ChapterBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapterBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
