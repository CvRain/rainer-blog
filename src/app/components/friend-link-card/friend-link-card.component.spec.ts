import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendLinkCardComponent } from './friend-link-card.component';

describe('FriendLinkCardComponent', () => {
  let component: FriendLinkCardComponent;
  let fixture: ComponentFixture<FriendLinkCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendLinkCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendLinkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
