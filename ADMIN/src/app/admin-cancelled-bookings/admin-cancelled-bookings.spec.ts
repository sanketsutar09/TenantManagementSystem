import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCancelledBookings } from './admin-cancelled-bookings';

describe('AdminCancelledBookings', () => {
  let component: AdminCancelledBookings;
  let fixture: ComponentFixture<AdminCancelledBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCancelledBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCancelledBookings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
