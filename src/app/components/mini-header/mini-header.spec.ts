import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniHeader } from './mini-header';

describe('MiniHeader', () => {
  let component: MiniHeader;
  let fixture: ComponentFixture<MiniHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
