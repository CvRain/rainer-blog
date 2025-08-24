import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionManagement } from './collection-management';

describe('CollectionManagement', () => {
  let component: CollectionManagement;
  let fixture: ComponentFixture<CollectionManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
