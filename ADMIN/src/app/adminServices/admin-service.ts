import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private apiUrl = "http://localhost:3000/api/admin";

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
