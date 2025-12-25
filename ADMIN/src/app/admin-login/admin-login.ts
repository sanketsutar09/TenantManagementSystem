import { Component } from '@angular/core';
import { AdminService } from '../adminServices/admin-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {
email = '';
  password = '';
  toastMsg = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private adminService: AdminService,
    private router: Router
  ) {}

  login() {
  this.adminService.login(this.email, this.password).subscribe({
    next: (res) => {
      if (res.success) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminEmail', this.email);
        this.showToast(res.message, 'success');
        this.router.navigate(['/dashboard']).then(() => {
          window.location.reload(); 
        });
      } else {
        this.showToast(res.message, 'error');
      }
    },
    error: (err) => {
      this.showToast(err.error?.message || 'Login failed', 'error');
    }
  });
}


  showToast(msg: string, type: 'success' | 'error') {
    this.toastMsg = msg;
    this.toastType = type;
    setTimeout(() => this.toastMsg = '', 3000);
  }
}
