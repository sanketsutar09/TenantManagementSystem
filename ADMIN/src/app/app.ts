import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AdminNavbar } from "./admin-navbar/admin-navbar";
import { AdminLogin } from "./admin-login/admin-login";

@Component({
  selector: 'app-root',
  imports: [AdminNavbar, RouterOutlet, AdminLogin],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ADMIN');
  isAdminLoggedIn = false;
  currentUrl = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.checkLogin();

      // Listen for route changes
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.urlAfterRedirects;
          this.checkLogin();
        }
      });
    }
  }

  checkLogin() {
    if (typeof window !== 'undefined') {
      this.isAdminLoggedIn =
        sessionStorage.getItem('adminLoggedIn') === 'true' &&
        this.currentUrl !== '/login';  // 🔑 hide navbar if on /login
    } else {
      this.isAdminLoggedIn = false;
    }
  }
}
