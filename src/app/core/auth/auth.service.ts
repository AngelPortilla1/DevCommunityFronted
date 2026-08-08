import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';
import { tap, catchError, throwError, timer, Subscription, Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  session_id: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'devcommunity_access_token';
  private readonly REFRESH_TOKEN_KEY = 'devcommunity_refresh_token';
  private readonly SESSION_ID_KEY = 'devcommunity_session_id';

  // ✅ Signal como única fuente de verdad
  readonly user = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());

  private refreshSubscription?: Subscription;

  constructor(private api: ApiService, private router: Router) {}

  login(email: string, password: string): Observable<User> {
    const body = { email, password };

    return this.api.post<AuthResponse>('/auth/login', body).pipe(
      tap(res => this.saveTokens(res)),
      switchMap(() => this.getMe()),
      tap(user => this.user.set(user))
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const body = { username, email, password };
    return this.api.post('/auth/register', body);
  }

  initAuth(): Observable<User | null> {
    if (!this.hasTokens()) {
      this.user.set(null);
      return of(null);
    }

    return this.getMe().pipe(
      tap(user => {
        this.user.set(user);
        this.startTokenRotation();
      }),
      catchError(() => {
        this.forceLogout();
        return of(null);
      })
    );
  }

  getMe(): Observable<User> {
    return this.api.get<User>('/auth/me');
  }

  hasTokens(): boolean {
    return !!this.token && !!this.refreshToken;
  }

  doRefreshToken() {
    const refreshToken = this.refreshToken;
    if (!refreshToken) {
      this.forceLogout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.api.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken }).pipe(
      tap(res => this.saveTokens(res)),
      catchError(err => {
        this.forceLogout();
        return throwError(() => err);
      })
    );
  }

  logout() {
    const sessionId = this.sessionId;
    if (sessionId) {
      this.api.post('/auth/logout', { session_id: sessionId }).subscribe({
        next: () => this.forceLogout(),
        error: () => this.forceLogout()
      });
    } else {
      this.forceLogout();
    }
  }

  forceLogout() {
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  private clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.SESSION_ID_KEY);
    this.user.set(null);
    this.stopTokenRotation();
  }

  private saveTokens(res: AuthResponse) {
    if (res.access_token) localStorage.setItem(this.ACCESS_TOKEN_KEY, res.access_token);
    if (res.refresh_token) localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refresh_token);
    if (res.session_id) localStorage.setItem(this.SESSION_ID_KEY, res.session_id);

    this.startTokenRotation();
  }

  get token(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  get sessionId(): string | null {
    return localStorage.getItem(this.SESSION_ID_KEY);
  }

  private startTokenRotation() {
    this.stopTokenRotation();
    // Refresco cada 14 minutos asumiendo un ciclo corto, ajustable según backend
    this.refreshSubscription = timer(14 * 60 * 1000).subscribe(() => {
      this.doRefreshToken().subscribe();
    });
  }

  private stopTokenRotation() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = undefined;
    }
  }
}
