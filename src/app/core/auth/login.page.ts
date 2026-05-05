import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-universe">

      <!-- Ambient Background Orbs -->
      <div class="orb orb--cyan"></div>
      <div class="orb orb--purple"></div>
      <div class="orb orb--teal"></div>

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

      <!-- Login Card -->
      <div class="login-card">

        <!-- Glow ring -->
        <div class="card-glow"></div>

        <!-- Logo -->
        <div class="logo-area">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
              <line x1="12" y1="2" x2="12" y2="22" opacity="0.3"></line>
            </svg>
          </div>
          <span class="logo-text">DevCommunity</span>
        </div>

        <!-- Heading -->
        <header class="card-header">
          <h1 class="card-title">Bienvenido de vuelta</h1>
          <p class="card-subtitle">Ingresa a tu cuenta de desarrollador</p>
        </header>

        <!-- Form -->
        <form (submit)="submit()" class="login-form">

          <div class="field-group">
            <label class="field-label" for="login-email">Correo Electrónico</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3"></rect>
                <polyline points="22,5 12,13 2,5"></polyline>
              </svg>
              <input
                id="login-email"
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="tu@ejemplo.com"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label" for="login-password">Contraseña</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="3"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                <circle cx="12" cy="16" r="1"></circle>
              </svg>
              <input
                id="login-password"
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                autocomplete="current-password"
              />
            </div>
          </div>

          <button type="submit" class="submit-btn" [disabled]="isLoading">
            <span *ngIf="!isLoading">Iniciar Sesión</span>
            <span *ngIf="isLoading" class="loader-dots">
              <span></span><span></span><span></span>
            </span>
          </button>
        </form>

        <!-- Error -->
        <div *ngIf="error" class="error-banner">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ error }}
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
       UNIVERSE  (full-screen backdrop)
    ══════════════════════════════════ */
    .login-universe {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a1a;
      overflow: hidden;
      padding: 1.5rem;
    }

    /* ── Grid overlay ── */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
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
    .orb--cyan {
      width: 420px; height: 420px;
      background: rgba(34, 211, 238, .12);
      top: -10%; right: -5%;
      animation-delay: 0s;
    }
    .orb--purple {
      width: 480px; height: 480px;
      background: rgba(168, 85, 247, .10);
      bottom: -12%; left: -8%;
      animation-delay: -4s;
    }
    .orb--teal {
      width: 300px; height: 300px;
      background: rgba(45, 212, 191, .08);
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
      color: rgba(255, 255, 255, .06);
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
       LOGIN CARD  (glassmorphism)
    ══════════════════════════════════ */
    .login-card {
      position: relative;
      width: 100%;
      max-width: 420px;
      background: rgba(15, 15, 35, .65);
      backdrop-filter: blur(40px) saturate(1.4);
      -webkit-backdrop-filter: blur(40px) saturate(1.4);
      border: 1px solid rgba(255, 255, 255, .08);
      border-radius: 24px;
      padding: 2.5rem 2.25rem;
      z-index: 10;
      animation: cardIn .7s cubic-bezier(.16,1,.3,1) both;
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
      background: linear-gradient(135deg, rgba(34,211,238,.25), rgba(168,85,247,.2), rgba(45,212,191,.15));
      z-index: -1;
      opacity: .45;
      filter: blur(2px);
      animation: glowPulse 4s ease-in-out infinite alternate;
    }
    @keyframes glowPulse {
      0%   { opacity: .30; }
      100% { opacity: .55; }
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
      background: linear-gradient(135deg, #22d3ee, #a855f7);
      color: #fff;
      padding: 6px;
    }
    .logo-icon svg { width: 100%; height: 100%; }
    .logo-text {
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -.02em;
      background: linear-gradient(135deg, #e2e8f0, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* ── Header ── */
    .card-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .card-title {
      font-size: 1.65rem;
      font-weight: 800;
      color: #f1f5f9;
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
      color: #94a3b8;
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
      color: #475569;
      transition: color .25s;
      pointer-events: none;
    }
    .input-wrapper input {
      width: 100%;
      background: rgba(255, 255, 255, .04);
      border: 1px solid rgba(255, 255, 255, .08);
      border-radius: 14px;
      padding: .85rem 1rem .85rem 2.8rem;
      font-size: .95rem;
      font-family: inherit;
      color: #e2e8f0;
      transition: border-color .3s, box-shadow .3s, background .3s;
      outline: none;
      box-sizing: border-box;
    }
    .input-wrapper input::placeholder {
      color: #475569;
    }
    .input-wrapper input:focus {
      border-color: rgba(34, 211, 238, .5);
      box-shadow: 0 0 0 3px rgba(34, 211, 238, .1), 0 0 20px rgba(34, 211, 238, .05);
      background: rgba(255, 255, 255, .06);
    }
    .input-wrapper input:focus ~ .input-icon,
    .input-wrapper:focus-within .input-icon {
      color: #22d3ee;
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
      background: linear-gradient(135deg, #22d3ee, #8b5cf6);
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
      box-shadow: 0 8px 30px rgba(34, 211, 238, .25), 0 4px 15px rgba(139, 92, 246, .2);
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

    /* ── Error Banner ── */
    .error-banner {
      margin-top: 1.25rem;
      display: flex;
      align-items: center;
      gap: .6rem;
      padding: .85rem 1rem;
      border-radius: 12px;
      background: rgba(239, 68, 68, .08);
      border: 1px solid rgba(239, 68, 68, .18);
      color: #fca5a5;
      font-size: .85rem;
      font-weight: 500;
      animation: shakeIn .4s ease;
    }
    .error-banner svg {
      width: 18px; height: 18px;
      flex-shrink: 0;
      color: #ef4444;
    }
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
      color: #475569;
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
export class LoginPage {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) { }

  submit() {
    this.isLoading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/posts']);
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}