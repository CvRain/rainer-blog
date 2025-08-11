import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownViewer } from './markdown-viewer';

describe('MarkdownViewer', () => {
  let component: MarkdownViewer;
  let fixture: ComponentFixture<MarkdownViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkdownViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
