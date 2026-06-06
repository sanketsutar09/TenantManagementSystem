import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingServiceService {

  private baseUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
  
  getOwnerBookings(ownerEmail: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/owner/${ownerEmail}`);
  }
}
