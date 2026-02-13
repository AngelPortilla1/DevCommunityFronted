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
      this.loadUser();
    }
  }

  login(email: string, password: string) {
    return this.api.post<{ access_token: string }>(
      '/auth/login',
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.access_token);
        this.loadUser();
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

  private loadUser() {
    this.api.get<User>('/auth/me').subscribe({
      next: (user) => {
        this.user.set(user);
      },
      error: () => {
        this.logout();
      }
    });
  }


}
