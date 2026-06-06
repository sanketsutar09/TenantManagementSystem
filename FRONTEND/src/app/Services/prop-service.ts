import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  bhk: string;
  size: number;
  price: number;
  address: string;
  location: string;
  availableFrom: string;
  furnished: string;
  status: string;
  available: number; 
  images: string[]; // image paths
}
@Injectable({
  providedIn: 'root'
})
export class PropService {
   private baseUrl = `${environment.apiUrl}/property`;
   private bookingUrl = `${environment.apiUrl}/booking`;

  constructor(private http: HttpClient) {}

  uploadProperty(data: FormData) {
    return this.http.post(`${this.baseUrl}/upload`, data);
  }

    getAllProperties() {
    return this.http.get<any[]>(`${this.baseUrl}`); 
  }

  getPropertyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  bookProperty(bookingData: any): Observable<any> {
    return this.http.post(this.bookingUrl, bookingData);
  }
  
  getPropertiesByUserEmail(email: string): Observable<Property[]> {
  return this.http.get<Property[]>(`${this.baseUrl}/user/${encodeURIComponent(email)}`);
}
 updateProperty(id: string, formData: FormData) {
  return this.http.put(`${this.baseUrl}/${id}`, formData);
}

deleteProperty(propertyId: string) {
  return this.http.delete(`${this.baseUrl}/delete/${propertyId}`);
}

}
