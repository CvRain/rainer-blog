import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleManagement } from './article-management';

describe('ArticleManagement', () => {
  let component: ArticleManagement;
  let fixture: ComponentFixture<ArticleManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
