import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDetails {
  cnp: string;
  nrMatricol: string;
  facultate: string;
  dataNasterii: string;
  nume: string;
  prenume: string;
  prenumeTata?: string;
  prenumeMama?: string;
  sex: string;
  judetulNasterii: string;
  localitateaNasterii: string;
  nationalitate: string;
  seriaBuletin: string;
  numarBuletin: string;
  adresa: string;
  handicap?: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root' // serviciul este singleton și disponibil global
})
export class UserDetailsService {
  private apiUrl = 'https://localhost:7284/api/userdetails';

  constructor(private http: HttpClient) {}

  getMyDetails(): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.apiUrl}/my`);
  }

  saveDetails(details: UserDetails): Observable<any> {
    return this.http.post(this.apiUrl, details);
  }

  deleteMyDetails(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/my`);
  }
}
