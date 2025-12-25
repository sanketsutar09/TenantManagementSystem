import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeletedPropertiies } from './admin-deleted-propertiies';

describe('AdminDeletedPropertiies', () => {
  let component: AdminDeletedPropertiies;
  let fixture: ComponentFixture<AdminDeletedPropertiies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDeletedPropertiies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeletedPropertiies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
