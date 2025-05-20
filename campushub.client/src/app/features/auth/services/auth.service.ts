import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';


export interface JwtPayload {
  sub: string;
  name: string;
  jti: string;
  exp: number;
  iat: number;
  // Adaugă alte câmpuri din token dacă ai, ex: role
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (e) {
      return false;
    }
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: JwtPayload = jwtDecode(token);
      return decoded.name;
    } catch {
      return null;
    }
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: JwtPayload = jwtDecode(token);
      return decoded.sub; // sau decoded.nameid, dacă JWT-ul tău folosește alt câmp
    } catch {
      return null;
    }
  }


  logout(): void {
    this.removeToken();
    // Poți adăuga redirect aici dacă vrei
  }
}
