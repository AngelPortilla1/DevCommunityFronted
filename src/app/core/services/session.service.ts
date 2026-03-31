import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Session, SessionMetrics } from '../models/session.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private api = inject(ApiService);

  getActiveSessions(): Observable<{ sessions: Session[] }> {
    return this.api.get<{ sessions: Session[] }>('/auth/sessions');
  }

  getMetrics(): Observable<SessionMetrics> {
    return this.api.get<SessionMetrics>('/auth/sessions/metrics');
  }

  revokeSession(sessionId: string): Observable<void> {
    return this.api.delete<void>(`/auth/sessions/${sessionId}`);
  }

  revokeOtherSessions(): Observable<void> {
    return this.api.delete<void>('/auth/sessions/terminate-others');
  }
}
