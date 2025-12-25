import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUploadProperty } from './admin-upload-property';

describe('AdminUploadProperty', () => {
  let component: AdminUploadProperty;
  let fixture: ComponentFixture<AdminUploadProperty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUploadProperty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUploadProperty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
