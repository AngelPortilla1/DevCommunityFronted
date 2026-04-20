import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';
import { tap, catchError, throwError, timer, Subscription, BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

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

  private authState$ = new BehaviorSubject<User | null>(null);
  private refreshSubscription?: Subscription;

  get user$(): Observable<User | null> {
    return this.authState$.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  // Helper for components using signals
  user = signal<User | null>(null);

  constructor(private api: ApiService, private router: Router) {
    this.user$.subscribe(u => this.user.set(u));
  }

  login(email: string, password: string): Observable<User> {
    const body = {
      email: email,
      password: password
    };

    return this.api.post<AuthResponse>('/auth/login', body).pipe(
      tap(res => this.saveTokens(res)),
      switchMap(() => this.getMe()),
      tap(user => this.authState$.next(user))
    );
  }

  initAuth(): Observable<User | null> {
    if (!this.hasTokens()) {
      this.authState$.next(null);
      return of(null);
    }

    return this.getMe().pipe(
      tap(user => {
        this.authState$.next(user);
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

  isAuthenticated(): boolean {
    return !!this.authState$.value;
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
    this.authState$.next(null);
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
