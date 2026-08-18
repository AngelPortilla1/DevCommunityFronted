import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/auth/auth.service';
import { Session, SessionMetrics } from '../../core/models/session.model';
import {
  LucideAngularModule,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Laptop,
  Monitor,
  Globe,
  KeyRound,
  Bell,
  User as UserIcon,
  Lock,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  SlidersHorizontal,
  Cpu,
  Layers,
  Eye,
  RefreshCw,
  Settings,
  Activity,
  HardDrive,
  Terminal,
  Code2,
  Palette,
  Moon,
  Sun,
  Fingerprint,
  Check,
  Copy,
  X,
  Database,
  Sparkles,
  Clock,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCheck,
  Mail,
  Share2,
  Download,
  Save,
  Shield
} from 'lucide-angular';

export type SettingsTab = 'security' | 'account' | 'notifications' | 'preferences' | 'privacy';

@Component({
  selector: 'app-sessions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.css']
})
export class SessionsPage implements OnInit {
  sessionService = inject(SessionService);
  authService = inject(AuthService);

  // Lucide Icons
  readonly ShieldCheck = ShieldCheck;
  readonly ShieldAlert = ShieldAlert;
  readonly Smartphone = Smartphone;
  readonly Laptop = Laptop;
  readonly Monitor = Monitor;
  readonly Globe = Globe;
  readonly KeyRound = KeyRound;
  readonly Bell = Bell;
  readonly UserIcon = UserIcon;
  readonly Lock = Lock;
  readonly Trash2 = Trash2;
  readonly LogOut = LogOut;
  readonly CheckCircle2 = CheckCircle2;
  readonly AlertTriangle = AlertTriangle;
  readonly Sliders = Sliders;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly Cpu = Cpu;
  readonly Layers = Layers;
  readonly Eye = Eye;
  readonly RefreshCw = RefreshCw;
  readonly Settings = Settings;
  readonly Activity = Activity;
  readonly HardDrive = HardDrive;
  readonly Terminal = Terminal;
  readonly Code2 = Code2;
  readonly Palette = Palette;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly Fingerprint = Fingerprint;
  readonly Check = Check;
  readonly Copy = Copy;
  readonly X = X;
  readonly Database = Database;
  readonly Sparkles = Sparkles;
  readonly Clock = Clock;
  readonly ExternalLink = ExternalLink;
  readonly ChevronRight = ChevronRight;
  readonly Info = Info;
  readonly CheckCheck = CheckCheck;
  readonly Mail = Mail;
  readonly Share2 = Share2;
  readonly Download = Download;
  readonly Save = Save;
  readonly Shield = Shield;

  // State Signals
  user = this.authService.user;
  sessions = signal<Session[]>([]);
  metrics = signal<SessionMetrics | null>(null);
  loading = signal<boolean>(true);
  isRefreshing = signal<boolean>(false);
  activeTab = signal<SettingsTab>('security');

  // Interactive Action States
  revokingSessionId = signal<string | null>(null);
  isRevokingOthers = signal<boolean>(false);
  copiedIp = signal<string | null>(null);
  toastMessage = signal<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);
  private toastTimer: any = null;

  // Custom Modal for Revoke Confirmations
  modalState = signal<{
    isOpen: boolean;
    title: string;
    description: string;
    targetId?: string;
    isAllOthers?: boolean;
  }>({
    isOpen: false,
    title: '',
    description: ''
  });

  // User Preferences (Persisted locally for Social Network experience)
  notificationSettings = signal({
    pushLikes: true,
    pushComments: true,
    pushMentions: true,
    emailWeeklyDigest: true,
    emailSecurityAlerts: true,
    soundEffects: false
  });

  devSettings = signal({
    syntaxHighlight: 'typescript',
    fontSize: '14px',
    tabSize: '2',
    lineNumbers: true,
    compactFeed: false,
    autoPlayGifs: true
  });

  privacySettings = signal({
    publicProfile: true,
    showOnlineStatus: true,
    showConnectedDevices: true,
    allowIndexing: true
  });

  isSavingPreferences = signal<boolean>(false);

  ngOnInit() {
    this.loadSavedPreferences();
    this.loadData();
  }

  loadData() {
    this.isRefreshing.set(true);

    this.sessionService.getActiveSessions().subscribe({
      next: (response) => {
        const mapped = response.sessions || [];

        // Colocar la sesión actual siempre al principio
        mapped.sort((a, b) => {
          if (a.is_current) return -1;
          if (b.is_current) return 1;
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
        });

        this.sessions.set(mapped);
        this.loading.set(false);
        this.isRefreshing.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.isRefreshing.set(false);
        this.showToast('No se pudieron cargar las sesiones.', 'danger');
      }
    });

    this.sessionService.getMetrics().subscribe({
      next: (data) => {
        this.metrics.set(data);
      },
      error: () => {
        // Silent or handled
      }
    });
  }

  setTab(tab: SettingsTab) {
    this.activeTab.set(tab);
  }

  copyIp(ip: string) {
    if (!ip) return;
    navigator.clipboard?.writeText(ip).then(() => {
      this.copiedIp.set(ip);
      this.showToast(`IP ${ip} copiada al portapapeles`, 'success');
      setTimeout(() => {
        if (this.copiedIp() === ip) {
          this.copiedIp.set(null);
        }
      }, 2500);
    }).catch(() => {
      this.showToast(`IP: ${ip}`, 'info');
    });
  }

  // --- Revoke Modals & Logic ---
  openRevokeModal(session: Session) {
    const id = session.device_id || session.session_id;
    const deviceName = `${session.device_info?.os || 'Dispositivo'} en ${session.device_info?.browser || 'Navegador'}`;
    this.modalState.set({
      isOpen: true,
      title: '¿Revocar acceso a esta sesión?',
      description: `Se cerrará inmediatamente la sesión de ${deviceName} (${session.ip_address}). Para volver a usarla, se requerirá iniciar sesión de nuevo.`,
      targetId: id,
      isAllOthers: false
    });
  }

  openRevokeOthersModal() {
    this.modalState.set({
      isOpen: true,
      title: '¿Cerrar todas las demás sesiones?',
      description: 'Se revocarán todas las sesiones activas en teléfonos, computadoras y otros navegadores excepto la que estás usando ahora mismo.',
      isAllOthers: true
    });
  }

  closeModal() {
    this.modalState.set({ isOpen: false, title: '', description: '' });
  }

  confirmModalAction() {
    const state = this.modalState();
    if (!state.isOpen) return;

    if (state.isAllOthers) {
      this.isRevokingOthers.set(true);
      this.closeModal();
      this.sessionService.revokeOtherSessions().subscribe({
        next: () => {
          this.isRevokingOthers.set(false);
          this.showToast('Todas las demás sesiones fueron cerradas con éxito.', 'success');
          this.loadData();
        },
        error: () => {
          this.isRevokingOthers.set(false);
          this.showToast('Error al cerrar las demás sesiones.', 'danger');
        }
      });
    } else if (state.targetId) {
      const sessionId = state.targetId;
      this.revokingSessionId.set(sessionId);
      this.closeModal();
      this.sessionService.revokeSession(sessionId).subscribe({
        next: () => {
          this.revokingSessionId.set(null);
          this.showToast('Sesión revocada exitosamente.', 'success');
          this.loadData();
        },
        error: () => {
          this.revokingSessionId.set(null);
          this.showToast('Error al revocar la sesión seleccionada.', 'danger');
        }
      });
    }
  }

  // --- Preferences persistence ---
  loadSavedPreferences() {
    try {
      const notifs = localStorage.getItem('devcomm_settings_notifs');
      if (notifs) this.notificationSettings.set(JSON.parse(notifs));

      const devs = localStorage.getItem('devcomm_settings_dev');
      if (devs) this.devSettings.set(JSON.parse(devs));

      const priv = localStorage.getItem('devcomm_settings_priv');
      if (priv) this.privacySettings.set(JSON.parse(priv));
    } catch {
      // ignore
    }
  }

  saveAllPreferences() {
    this.isSavingPreferences.set(true);
    try {
      localStorage.setItem('devcomm_settings_notifs', JSON.stringify(this.notificationSettings()));
      localStorage.setItem('devcomm_settings_dev', JSON.stringify(this.devSettings()));
      localStorage.setItem('devcomm_settings_priv', JSON.stringify(this.privacySettings()));

      setTimeout(() => {
        this.isSavingPreferences.set(false);
        this.showToast('¡Ajustes y preferencias guardados correctamente!', 'success');
      }, 400);
    } catch (e) {
      this.isSavingPreferences.set(false);
      this.showToast('No se pudieron guardar las preferencias.', 'danger');
    }
  }

  toggleNotif(key: keyof ReturnType<typeof this.notificationSettings>) {
    this.notificationSettings.update(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  togglePrivacy(key: keyof ReturnType<typeof this.privacySettings>) {
    this.privacySettings.update(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  toggleDev(key: 'lineNumbers' | 'compactFeed' | 'autoPlayGifs') {
    this.devSettings.update(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  exportDataJson() {
    const data = {
      user: this.user(),
      active_sessions_count: this.sessions().length,
      metrics: this.metrics(),
      preferences: {
        notifications: this.notificationSettings(),
        developer: this.devSettings(),
        privacy: this.privacySettings()
      },
      exported_at: new Date().toISOString()
    };

    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `devcommunity-data-${this.user()?.username || 'account'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    this.showToast('Descarga de datos completada.', 'success');
  }

  showToast(text: string, type: 'success' | 'danger' | 'info' = 'success') {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastMessage.set({ text, type });
    this.toastTimer = setTimeout(() => {
      this.toastMessage.set(null);
    }, 3500);
  }

  formatDate(dateStr?: string | null): string {
    if (!dateStr) return 'Reciente';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDeviceIcon(session: Session) {
    if (session.device_info?.is_mobile) return this.Smartphone;
    if (session.device_info?.is_tablet) return this.Monitor;
    return this.Laptop;
  }
}
