import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient){}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {email, password});
  }

   getAllData(email?: string): Observable<any> {
    let url = `${this.apiUrl}/all-data`;
    if (email) {
      url += `?email=${email}`;
    }
    return this.http.get<any>(url);
  }

  createUser(user: { name: string; email: string; password: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/create-user`, user);
}

}
