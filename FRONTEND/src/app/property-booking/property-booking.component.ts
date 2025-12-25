import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PropService } from '../Services/prop-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../Services/auth-service';
import { AlertComponent } from "../shared/alert/alert.component";



@Component({
  selector: 'app-property-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './property-booking.component.html',
  styleUrl: './property-booking.component.css'
})
export class PropertyBookingComponent implements OnInit {
  property: any;
  bookingForm!: FormGroup;
  isBrowser = false;
  user: any = { name: '', email: '' }; // prevent undefined flicker
  isLoaded = false;
  showPopup = false;
  bookingData: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isLoaded = true;
    // Create form once
    this.bookingForm = this.fb.group(
      {
        // Property details
        title: [{ value: '', disabled: true }],
        type: [{ value: '', disabled: true }],
        bhk: [{ value: '', disabled: true }],
        size: [{ value: '', disabled: true }],
        price: [{ value: '', disabled: true }],
        address: [{ value: '', disabled: true }],
        furnished: [{ value: '', disabled: true }],

        // User details
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        dob: ['', Validators.required],
        govIdType: ['', Validators.required],
        govIdNumber: ['', Validators.required],

        // Booking dates
        checkInDate: ['', [Validators.required, this.futureDateValidator]],
        checkOutDate: ['', Validators.required],

        // Emergency contact
        emergencyName: ['', Validators.required],
        emergencyPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],

        // Notes
        notes: ['']
      },
      {
        validators: [this.checkOutAfterCheckInValidator]
      }
    );

    // Load logged-in user details
    if (this.isBrowser) {
      const storedEmail = this.authService.getStoredUserEmail();
      if (storedEmail) {
        this.loadUserData(storedEmail);
      }

      // Keep listening for future changes
      this.authService.userEmail$.subscribe(email => {
        if (email) {
          this.loadUserData(email);
          this.cd.detectChanges();
        }
      });
    }

    // Load property details
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyService.getPropertyById(id).subscribe((data) => {
        this.property = data;
        this.bookingForm.patchValue({
          title: data.title,
          type: data.type,
          bhk: data.bhk,
          size: data.size,
          price: data.price,
          address: data.address,
          furnished: data.furnished
        });
        this.cd.detectChanges();
      });
    }
  }

  private loadUserData(email: string) {
    this.authService.getUserProfile(email).subscribe(res => {
      this.user = res;
      this.bookingForm.patchValue({
        name: res.name,
        email: res.email
      });
      this.isLoaded = true;

      // Force immediate UI update
      this.cd.detectChanges();
    });
  }

  // Custom validator: check-in date must be after today
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(control.value);
    return checkIn >= today ? null : { notFutureDate: true };
  }

  // Custom validator: check-out must be after check-in
  checkOutAfterCheckInValidator(group: AbstractControl): ValidationErrors | null {
    const checkIn = group.get('checkInDate')?.value;
    const checkOut = group.get('checkOutDate')?.value;
    if (!checkIn || !checkOut) return null;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return checkOutDate >= checkInDate ? null : { checkOutBeforeCheckIn: true };
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const bookingData = {
        ...this.bookingForm.getRawValue(),
        propertyId: this.property?._id
      };
      console.log('Booking Data:', bookingData);
      
      this.propertyService.bookProperty(bookingData).subscribe({
        next: (res) => {
          // alert(res.message);
          this.showAlert('Property booked successfully.', 'success');
          console.log('Booking saved:', res.booking);
        },
        error: (err) => {
          console.error('Booking error:', err);
          this.showAlert('Property booking failed', 'error');
        }
      });

    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  alertMessage: string | null = null;
  alertType: 'success' | 'error' | 'warning' = 'success';

  showAlert(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.alertMessage = message;
    this.alertType = type;
    this.cd.detectChanges(); // force update

    setTimeout(() => {
      this.alertMessage = null;
      this.router.navigate(['/'])
      this.bookingForm.reset();
    }, 3000);
  }

}
