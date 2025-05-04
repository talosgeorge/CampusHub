import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  private apiUrl = '/api/userdetails'; // Adjust based on your API URL

  constructor(private http: HttpClient) { }

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my`);
  }

  updateUserDetails(details: any): Observable<any> {
    return this.http.post(this.apiUrl, details);
  }
}
