import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleReader } from './article-reader';

describe('ArticleReader', () => {
  let component: ArticleReader;
  let fixture: ComponentFixture<ArticleReader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleReader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleReader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
