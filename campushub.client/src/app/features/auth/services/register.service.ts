import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = `https://localhost:7284/api/reg/register`;
  http = inject(HttpClient);
  
  register(username:string,email:string,password:string) : Observable<any>{
    return this.http.post(this.apiUrl,{username,email,password});
  }
}
