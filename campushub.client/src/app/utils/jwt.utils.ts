import { jwtDecode } from 'jwt-decode';

export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token'); // sau sessionStorage
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded?.nameid || decoded?.sub || null;
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
}
