import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/auth/auth.service';
import { Session, SessionMetrics } from '../../core/models/session.model';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sessions.page.html'
})
export class SessionsPage implements OnInit {
  sessionService = inject(SessionService);
  authService = inject(AuthService);

  sessions = signal<Session[]>([]);
  metrics = signal<SessionMetrics | null>(null);
  
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    this.sessionService.getActiveSessions().subscribe({
      next: (response) => {
        const mapped = response.sessions;
        
        // Colocar la sesión actual siempre al principio
        mapped.sort((a, b) => {
          if (a.is_current) return -1;
          if (b.is_current) return 1;
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
        });
        
        this.sessions.set(mapped);
      },
      error: () => this.loading.set(false)
    });

    this.sessionService.getMetrics().subscribe({
      next: (data) => {
        this.metrics.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  revokeSession(sessionId: string) {
    if (confirm('¿Seguro que deseas cerrar esta sesión? Se cerrará automáticamente en ese dispositivo.')) {
      this.sessionService.revokeSession(sessionId).subscribe({
        next: () => this.loadData(),
        error: (err) => alert('Error al cerrar la sesión.')
      });
    }
  }

  revokeOthers() {
    if (confirm('Se cerrarán todas las demás sesiones excepto esta. ¿Confirmas?')) {
      this.sessionService.revokeOtherSessions().subscribe({
        next: () => this.loadData(),
        error: (err) => alert('Error al cerrar las demás sesiones.')
      });
    }
  }
}
