import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryCard } from './gallery-card';

describe('GalleryCard', () => {
  let component: GalleryCard;
  let fixture: ComponentFixture<GalleryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
