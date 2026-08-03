import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-universe">

      <!-- Ambient Background Orbs (Updated to Emerald/Yellow) -->
      <div class="orb orb--emerald"></div>
      <div class="orb orb--yellow"></div>
      <div class="orb orb--slate"></div>

      <!-- Floating Code Symbols -->
      <span class="code-float code-float--1">{{ '{' }} {{ '}' }}</span>
      <span class="code-float code-float--2">&lt;/&gt;</span>
      <span class="code-float code-float--3">const</span>
      <span class="code-float code-float--4">=&gt;</span>
      <span class="code-float code-float--5">| |</span>
      <span class="code-float code-float--6">[ ]</span>
      <span class="code-float code-float--7">async</span>
      <span class="code-float code-float--8">npm</span>

      <!-- Grid overlay -->
      <div class="grid-overlay"></div>

      <!-- Register Card -->
      <div class="login-card">

        <!-- Glow ring (Updated to Emerald/Yellow) -->
        <div class="card-glow"></div>

        <!-- Logo -->
        <div class="logo-area">
          <img src="assets/LogoDevCommunity.png" alt="DevCommunity Logo" class="h-16 w-auto mb-2 drop-shadow-lg">
          <span class="logo-text">DevCommunity</span>
        </div>

        <!-- Heading -->
        <header class="card-header">
          <h1 class="card-title">Crea tu cuenta</h1>
          <p class="card-subtitle">Únete a nuestra comunidad de desarrolladores</p>
        </header>

        <!-- Form -->
        <form (submit)="submit()" class="login-form">

          <div class="field-group">
            <label class="field-label" for="register-username">Nombre de Usuario</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                id="register-username"
                type="text"
                [(ngModel)]="username"
                name="username"
                placeholder="developer_123"
                autocomplete="username"
                required
              />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label" for="register-email">Correo Electrónico</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3"></rect>
                <polyline points="22,5 12,13 2,5"></polyline>
              </svg>
              <input
                id="register-email"
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="tu@ejemplo.com"
                autocomplete="email"
                required
              />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label" for="register-password">Contraseña</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="3"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                <circle cx="12" cy="16" r="1"></circle>
              </svg>
              <input
                id="register-password"
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Mínimo 8 caracteres"
                autocomplete="new-password"
                required
              />
            </div>
          </div>

          <button type="submit" class="submit-btn" [disabled]="isLoading">
            <span *ngIf="!isLoading">Registrarse</span>
            <span *ngIf="isLoading" class="loader-dots">
              <span></span><span></span><span></span>
            </span>
          </button>
        </form>

        <div class="auth-links">
          <p class="auth-link-text">
            ¿Ya tienes una cuenta? <a routerLink="/login" class="auth-link">Inicia Sesión</a>
          </p>
        </div>

        <!-- Error -->
        <div *ngIf="error" class="error-banner">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ error }}
        </div>

        <!-- Success -->
        <div *ngIf="successMsg" class="success-banner">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          {{ successMsg }}
        </div>

        <!-- Footer -->
        <footer class="card-footer">
          DevCommunity &copy; 2026
        </footer>
      </div>
    </div>
  `,
  styles: [`
    /* ── Import Google Font ── */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    :host {
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
    }

    /* ══════════════════════════════════
       UNIVERSE  (light palette backdrop)
    ══════════════════════════════════ */
    .login-universe {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f1f5f9;
      overflow: hidden;
      padding: 1.5rem;
    }

    /* ── Grid overlay ── */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(15, 23, 42, .03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 23, 42, .03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }

    /* ── Ambient Orbs ── */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      pointer-events: none;
      animation: drift 12s ease-in-out infinite alternate;
    }
    .orb--emerald {
      width: 420px; height: 420px;
      background: rgba(16, 185, 129, .12);
      top: -10%; right: -5%;
      animation-delay: 0s;
    }
    .orb--yellow {
      width: 480px; height: 480px;
      background: rgba(251, 191, 36, .10);
      bottom: -12%; left: -8%;
      animation-delay: -4s;
    }
    .orb--slate {
      width: 300px; height: 300px;
      background: rgba(15, 23, 42, .05);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -8s;
    }
    @keyframes drift {
      0%   { transform: translate(0, 0) scale(1); }
      50%  { transform: translate(30px, -20px) scale(1.08); }
      100% { transform: translate(-20px, 25px) scale(0.95); }
    }

    /* ── Floating Code Symbols ── */
    .code-float {
      position: absolute;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.85rem;
      font-weight: 600;
      color: rgba(15, 23, 42, .08);
      pointer-events: none;
      animation: floatUp 18s linear infinite;
      user-select: none;
    }
    .code-float--1 { left: 8%;  top: 90%; animation-duration: 20s; font-size: 1.1rem; }
    .code-float--2 { left: 18%; top: 95%; animation-duration: 24s; animation-delay: -3s; }
    .code-float--3 { left: 35%; top: 92%; animation-duration: 22s; animation-delay: -7s; font-size: 0.75rem; }
    .code-float--4 { left: 55%; top: 88%; animation-duration: 19s; animation-delay: -2s; }
    .code-float--5 { left: 72%; top: 93%; animation-duration: 25s; animation-delay: -10s; font-size: 1rem; }
    .code-float--6 { left: 85%; top: 90%; animation-duration: 21s; animation-delay: -5s; }
    .code-float--7 { left: 45%; top: 96%; animation-duration: 26s; animation-delay: -13s; font-size: 0.7rem; }
    .code-float--8 { left: 62%; top: 91%; animation-duration: 23s; animation-delay: -8s; }

    @keyframes floatUp {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateY(-110vh) rotate(15deg); opacity: 0; }
    }

    /* ══════════════════════════════════
       REGISTER CARD  (glassmorphism light)
    ══════════════════════════════════ */
    .login-card {
      position: relative;
      width: 100%;
      max-width: 420px;
      background: rgba(255, 255, 255, .7);
      backdrop-filter: blur(20px) saturate(1.8);
      -webkit-backdrop-filter: blur(20px) saturate(1.8);
      border: 1px solid rgba(15, 23, 42, .1);
      border-radius: 24px;
      padding: 2.5rem 2.25rem;
      z-index: 10;
      animation: cardIn .7s cubic-bezier(.16,1,.3,1) both;
      box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.1);
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(30px) scale(.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Glow ring behind card */
    .card-glow {
      position: absolute;
      inset: -2px;
      border-radius: 26px;
      background: linear-gradient(135deg, rgba(16, 185, 129, .2), rgba(251, 191, 36, .15), rgba(15, 23, 42, .1));
      z-index: -1;
      opacity: .45;
      filter: blur(4px);
      animation: glowPulse 4s ease-in-out infinite alternate;
    }
    @keyframes glowPulse {
      0%   { opacity: .20; }
      100% { opacity: .45; }
    }

    /* ── Logo ── */
    .logo-area {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .65rem;
      margin-bottom: 2rem;
    }
    .logo-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: linear-gradient(135deg, #059669, #fbbf24);
      color: #fff;
      padding: 6px;
    }
    .logo-icon svg { width: 100%; height: 100%; }
    .logo-text {
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -.02em;
      color: #0f172a;
    }

    /* ── Header ── */
    .card-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .card-title {
      font-size: 1.65rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -.03em;
      margin: 0 0 .4rem;
    }
    .card-subtitle {
      font-size: .9rem;
      color: #64748b;
      font-weight: 400;
      margin: 0;
    }

    /* ── Form ── */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .field-group {
      display: flex;
      flex-direction: column;
      gap: .45rem;
    }
    .field-label {
      font-size: .78rem;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: .06em;
    }
    .input-wrapper {
      position: relative;
    }
    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: #94a3b8;
      transition: color .25s;
      pointer-events: none;
    }
    .input-wrapper input {
      width: 100%;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: .85rem 1rem .85rem 2.8rem;
      font-size: .95rem;
      font-family: inherit;
      color: #0f172a;
      transition: border-color .3s, box-shadow .3s, background .3s;
      outline: none;
      box-sizing: border-box;
    }
    .input-wrapper input::placeholder {
      color: #94a3b8;
    }
    .input-wrapper input:focus {
      border-color: #059669;
      box-shadow: 0 0 0 3px rgba(5, 150, 105, .1);
    }
    .input-wrapper input:focus ~ .input-icon,
    .input-wrapper:focus-within .input-icon {
      color: #059669;
    }

    /* ── Submit Button ── */
    .submit-btn {
      margin-top: .75rem;
      width: 100%;
      padding: .9rem 1rem;
      font-size: 1rem;
      font-weight: 700;
      font-family: inherit;
      color: #fff;
      background: linear-gradient(135deg, #059669, #0f172a);
      border: none;
      border-radius: 14px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform .2s, box-shadow .3s;
      letter-spacing: -.01em;
    }
    .submit-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,.15), transparent);
      opacity: 0;
      transition: opacity .3s;
    }
    .submit-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 30px rgba(5, 150, 105, .2);
    }
    .submit-btn:hover::before { opacity: 1; }
    .submit-btn:active {
      transform: translateY(0) scale(.98);
    }
    .submit-btn:disabled {
      opacity: .7;
      cursor: not-allowed;
      transform: none;
    }

    /* Loading dots */
    .loader-dots {
      display: inline-flex;
      gap: 6px;
      align-items: center;
      justify-content: center;
    }
    .loader-dots span {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #fff;
      animation: dotPulse .9s ease-in-out infinite;
    }
    .loader-dots span:nth-child(2) { animation-delay: .15s; }
    .loader-dots span:nth-child(3) { animation-delay: .3s; }
    @keyframes dotPulse {
      0%, 80%, 100% { opacity: .3; transform: scale(.7); }
      40% { opacity: 1; transform: scale(1); }
    }

    /* ── Auth Links ── */
    .auth-links {
      margin-top: 1.5rem;
      text-align: center;
    }
    .auth-link-text {
      color: #64748b;
      font-size: 0.9rem;
      margin: 0;
    }
    .auth-link {
      color: #059669;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    .auth-link:hover {
      color: #fbbf24;
    }

    /* ── Error & Success Banners ── */
    .error-banner, .success-banner {
      margin-top: 1.25rem;
      display: flex;
      align-items: center;
      gap: .6rem;
      padding: .85rem 1rem;
      border-radius: 12px;
      font-size: .85rem;
      font-weight: 500;
      animation: shakeIn .4s ease;
    }
    .error-banner {
      background: #fef2f2;
      border: 1px solid #fee2e2;
      color: #b91c1c;
    }
    .success-banner {
      background: #f0fdf4;
      border: 1px solid #dcfce7;
      color: #15803d;
    }
    .error-banner svg, .success-banner svg {
      width: 18px; height: 18px;
      flex-shrink: 0;
    }
    .error-banner svg { color: #ef4444; }
    .success-banner svg { color: #22c55e; }
    @keyframes shakeIn {
      0%, 100% { transform: translateX(0); }
      25%  { transform: translateX(-6px); }
      50%  { transform: translateX(5px); }
      75%  { transform: translateX(-3px); }
    }

    /* ── Footer ── */
    .card-footer {
      margin-top: 2rem;
      text-align: center;
      font-size: .75rem;
      color: #94a3b8;
      font-weight: 500;
      letter-spacing: .02em;
    }

    /* ══════════════════════════════════
       RESPONSIVE
    ══════════════════════════════════ */
    @media (max-width: 480px) {
      .login-card {
        padding: 2rem 1.5rem;
        border-radius: 20px;
      }
      .card-title { font-size: 1.4rem; }
      .code-float { display: none; }
    }
  `]
})
export class RegisterPage {
  username = '';
  email = '';
  password = '';
  error = '';
  successMsg = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) { }

  submit() {
    if (!this.username || !this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.successMsg = '';
    
    this.auth.register(this.username, this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMsg = '¡Cuenta creada! Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        const detail = err.error?.detail;
        if (Array.isArray(detail)) {
          // Errores de validación de Pydantic (422): detail es un array
          this.error = detail.map((d: any) => d.msg).join('. ');
        } else if (typeof detail === 'string') {
          // Errores de negocio (400): detail es un string
          this.error = detail;
        } else {
          this.error = 'Error al registrar usuario. Inténtalo de nuevo.';
        }
      }
    });
  }
}
