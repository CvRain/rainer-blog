import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSidebar } from './article-sidebar';

describe('ArticleSidebar', () => {
  let component: ArticleSidebar;
  let fixture: ComponentFixture<ArticleSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
