import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css'
})
export class AdminNavbar {
 constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  menuOpen = false;
  dropdownOpen = false;
  isBrowser: boolean;
  isLoggedIn = false;
  mobileMenuOpen = false;

  activeMenu: string = 'home';

  setActive(menu: string, route: string) {
    this.activeMenu = menu;
    this.router.navigate([route]); 
  }

  logout() {
  sessionStorage.clear();
  this.router.navigate(['/admin-login']);
}

  get screenIsMdOrLarger(): boolean {
    if (this.isBrowser) {
      return window.innerWidth >= 768;
    }
    return false;
  }

  dashboard() {
    this.setActive('dashboard', '/dashboard')
    // this.router.navigate(['/dashboard']);
  }

  uploadProperty() {
     {
      this.setActive('uploadProperty', '/uploadProperty')
      // this.router.navigate(['/uploadProperty']);
    } 
  }

  // onUserLogin() {
  //   this.setActive('dash', '/dashboard')
  //   this.router.navigate(['/UserSignUp']);
  //   this.dropdownOpen = false;
  // }

  onCancelledBooking() {
     this.setActive('cancelledBooking', '/cancelledBooking');
    // this.router.navigate(['/cancelledBooking']);
  }

  toggleDropdown(event?: MouseEvent) {
    event?.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  onBooking() {
    this.setActive('booking', '/Booking');
    // this.router.navigate(['/Booking']);
  }

  onProperties() {
    this.setActive('properties', '/Properties')
    // this.router.navigate(['/Properties']);
  }

  onDeleteProperties(){
    this.setActive('deletedBooking', '/deletedBooking');
    // this.router.navigate(['/deletedBooking'])
  }

  onUsers() {
    this.setActive('users', '/Users')
    // this.router.navigate(['/Users']);
  }


  alertMessage: string | null = null;
  alertType: 'success' | 'error' | 'warning' = 'success';
  showAlert(message: string, type: 'error' | 'success' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;
    this.cd.detectChanges();
    setTimeout(() => {
      this.alertMessage = '';
      // this.cd.detectChanges();
    }, 3000);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.dropdownOpen = false;
    }
  }
}
