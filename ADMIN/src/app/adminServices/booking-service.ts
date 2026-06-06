import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Booking {
  _id: string;
  title: string;
  type: string;
  bhk: string;
  size: string;
  price: number;
  address: string;
  furnished: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  govIdType: string;
  govIdNumber: string;
  checkInDate: string;
  checkOutDate: string;
  emergencyName: string;
  emergencyPhone: string;
  notes?: string;
  propertyId?: any;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

   private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }
  
}
