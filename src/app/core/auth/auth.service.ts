import { Injectable, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'devcommunity_token';

  user = signal<User | null>(null);

  constructor(private api: ApiService) {
    const token = this.token;
    if (token) {
      this.loadUserFromToken();
    }
  }

  login(email: string, password: string) {
    return this.api.post<{ access_token: string }>(
      '/auth/login',
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.access_token);
        this.loadUserFromToken();
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.user.set(null);
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private loadUserFromToken() {
    /**
     * ⚠️ Backend aún no expone /me
     * Solución temporal:
     * - Decodificar JWT
     * - Extraer datos del payload
     */
    const token = this.token;
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    this.user.set({
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
    });
  }
}
