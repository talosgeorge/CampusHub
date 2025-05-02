import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'https://localhost:7284/api/account/login';

  http = inject(HttpClient);

  login(emailOrUsername:string,password:string): Observable<any> {
    return this.http.post(this.apiUrl, {emailOrUsername,password});
  }
}
