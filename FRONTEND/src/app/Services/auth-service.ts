import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// models/user.model.ts
export interface User {
  createdAt: any;
  password: any;
  _id: string;
  name: string;
  email: string;
  // add other fields your API returns
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/user`;
  private userEmailSource = new BehaviorSubject<string | null>(null);
  userEmail$ = this.userEmailSource.asObservable();
  isLoggedIn$ = this.userEmail$.pipe(map(email => !!email));
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone // ✅ Added
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const storedEmail = sessionStorage.getItem('userEmail');
      if (storedEmail) {
        this.zone.run(() => { // ✅ ensures emission is in Angular zone
          this.userEmailSource.next(storedEmail);
        });
      }
    }
  }

  getStoredUserEmail(): string | null {
    return this.isBrowser ? sessionStorage.getItem('userEmail') : null;
  }

  setUserEmail(email: string) {
    if (this.isBrowser) {
      sessionStorage.setItem('userEmail', email);
    }
    this.zone.run(() => { 
      this.userEmailSource.next(email);
    });
  }

  clearUserEmail() {
    if (this.isBrowser) {
      sessionStorage.removeItem('userEmail');
    }
    this.zone.run(() => {  
      this.userEmailSource.next(null);
    });
  }

  registerUser(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  loginUser(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  getUserProfile(email?: string) {
    return this.http.get<User>(`${this.baseUrl}/user/${email}`);
  }

  updateUserProfile(id: string, formData: FormData) {
    return this.http.put(`${this.baseUrl}/update/${id}`, formData);
  }

  incrementLoginCount(email: string) {
    return this.http.put(`${this.baseUrl}/increment-login/${email}`, {});
  }

  getUserBookings(email: string) {
  return this.http.get(
    `${environment.apiUrl}/booking/user/${encodeURIComponent(email)}`
  );
}

cancelUserbooking(bookingId: string): Observable<any>{
  return this.http.delete(`${environment.apiUrl}/booking/${bookingId}`)
}

private apiUrl = `${environment.apiUrl}/contact`;

 sendContactForm(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  sendFeedback(data: any){
    return this.http.post(`${environment.apiUrl}/feedback`, data)
  }

  getBookingsForMyProperties(email: string) {
  return this.http.get<any[]>(`${environment.apiUrl}/booking/owner/${email}`);
}



}
