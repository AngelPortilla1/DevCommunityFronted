import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterModule, AuthCardComponent],
  template: `
    <app-auth-card
      title="Bienvenido de vuelta"
      subtitle="Ingresa a tu cuenta de desarrollador">

      <!-- Form -->
      <form (submit)="submit()" class="auth-form">

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
              [type]="showPassword ? 'text' : 'password'"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              autocomplete="current-password"
              (blur)="showPassword = false"
            />
            <button
              type="button"
              class="toggle-password"
              [attr.aria-label]="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              [attr.aria-pressed]="showPassword"
              (click)="showPassword = !showPassword"
              tabindex="0"
            >
              @if (!showPassword) {
                <!-- Ojo tachado: contraseña oculta -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.39 1 12a10.94 10.94 0 0 1 2.06-3.94"/>
                  <path d="M9.9 4.24A9 9 0 0 1 12 4c5 0 9.27 3.61 11 8a10.94 10.94 0 0 1-1.06 2.06"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              } @else {
                <!-- Ojo abierto: contraseña visible -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              }
            </button>
          </div>
        </div>

        <button type="submit" class="submit-btn" [disabled]="isLoading">
          @if (!isLoading) {
            <span>Iniciar Sesión</span>
          } @else {
            <span class="loader-dots">
              <span></span><span></span><span></span>
            </span>
          }
        </button>
      </form>

      <!-- Auth link -->
      <div class="auth-links">
        <p class="auth-link-text">
          ¿No tienes una cuenta? <a routerLink="/register" class="auth-link">Regístrate</a>
        </p>
      </div>

      <!-- Error banner -->
      @if (error) {
        <div class="error-banner">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ error }}
        </div>
      }

    </app-auth-card>
  `,
  styles: [`
    /* ── Form layout ── */
    .auth-form {
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
      font-family: 'JetBrains Mono', monospace;
      font-size: .72rem;
      font-weight: 600;
      color: #8899AA;
      text-transform: uppercase;
      letter-spacing: .08em;
    }

    /* ── Input wrapper ── */
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
      color: #556677;
      transition: color .25s;
      pointer-events: none;
    }
    .input-wrapper input {
      width: 100%;
      background: rgba(10, 10, 15, 0.7);
      border: 1px solid rgba(136, 153, 170, 0.2);
      border-radius: 12px;
      padding: .85rem 2.8rem .85rem 2.8rem;
      font-size: .95rem;
      font-family: 'Inter', sans-serif;
      color: #E8E8F0;
      transition: border-color .25s, box-shadow .25s, background .25s;
      outline: none;
      box-sizing: border-box;
    }
    .input-wrapper input::placeholder { color: #3A4A5A; }
    .input-wrapper input:focus {
      border-color: rgba(192, 200, 216, 0.5);
      background: rgba(15, 15, 26, 0.9);
      box-shadow: 0 0 0 3px rgba(136, 153, 170, 0.12);
    }
    .input-wrapper:focus-within .input-icon { color: #C0C8D8; }

    /* ── Toggle password ── */
    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 8px;
      color: #556677;
      transition: color .2s, background .2s;
      padding: 0;
    }
    .toggle-password svg {
      width: 18px;
      height: 18px;
      transition: transform .2s;
    }
    .toggle-password:hover {
      color: #C0C8D8;
      background: rgba(136, 153, 170, 0.08);
    }
    .toggle-password:hover svg {
      transform: scale(1.1);
    }
    .toggle-password:focus-visible {
      outline: 2px solid rgba(192, 200, 216, 0.4);
      outline-offset: 2px;
      color: #E8EEF4;
    }

    /* ── Submit button ── */
    .submit-btn {
      margin-top: .75rem;
      width: 100%;
      padding: .9rem 1rem;
      font-size: 0.95rem;
      font-weight: 700;
      font-family: 'Space Grotesk', system-ui, sans-serif;
      color: #E8EEF4;
      background: linear-gradient(135deg, #8899AA 0%, #3A4A5A 100%);
      border: 1px solid rgba(192, 200, 216, 0.25);
      border-radius: 12px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform .2s, box-shadow .3s, background .2s;
      letter-spacing: .02em;
      box-shadow: 0 0 16px rgba(136, 153, 170, 0.15);
    }
    .submit-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(208, 216, 232, 0.15), transparent);
      opacity: 0;
      transition: opacity .3s;
    }
    .submit-btn:hover {
      background: linear-gradient(135deg, #AAB8C8 0%, #4A5A6A 100%);
      transform: translateY(-1px);
      box-shadow: 0 0 24px rgba(136, 153, 170, 0.25), 0 8px 20px rgba(0, 0, 0, 0.4);
    }
    .submit-btn:hover::before { opacity: 1; }
    .submit-btn:active { transform: translateY(0) scale(.98); }
    .submit-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

    /* ── Loader dots ── */
    .loader-dots {
      display: inline-flex;
      gap: 6px;
      align-items: center;
      justify-content: center;
    }
    .loader-dots span {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #E8EEF4;
      animation: dotPulse .9s ease-in-out infinite;
    }
    .loader-dots span:nth-child(2) { animation-delay: .15s; }
    .loader-dots span:nth-child(3) { animation-delay: .3s; }
    @keyframes dotPulse {
      0%, 80%, 100% { opacity: .3; transform: scale(.7); }
      40% { opacity: 1; transform: scale(1); }
    }

    /* ── Auth links ── */
    .auth-links {
      margin-top: 1.5rem;
      text-align: center;
    }
    .auth-link-text { color: #556677; font-size: .875rem; margin: 0; }
    .auth-link { color: #C0C8D8; text-decoration: none; font-weight: 600; transition: color .2s; }
    .auth-link:hover { color: #E8EEF4; text-decoration: underline; }

    /* ── Error banner ── */
    .error-banner {
      margin-top: 1.25rem;
      display: flex;
      align-items: center;
      gap: .6rem;
      padding: .85rem 1rem;
      border-radius: 12px;
      background: rgba(46, 20, 20, 0.8);
      border: 1px solid rgba(200, 90, 90, 0.35);
      color: #E07070;
      font-size: .85rem;
      font-weight: 500;
      animation: shakeIn .4s ease;
    }
    .error-banner svg { width: 18px; height: 18px; flex-shrink: 0; color: #E07070; }
    @keyframes shakeIn {
      0%, 100% { transform: translateX(0); }
      25%  { transform: translateX(-6px); }
      50%  { transform: translateX(5px); }
      75%  { transform: translateX(-3px); }
    }
  `]
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  error = '';
  isLoading = false;
  showPassword = false;

  submit() {
    this.isLoading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        this.isLoading = false;
        const status = err?.status;
        if (status === 401) {
          this.error = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (status === 0 || status >= 500) {
          this.error = 'Error del servidor. Inténtalo de nuevo más tarde.';
        } else {
          this.error = 'Ocurrió un error inesperado.';
        }
        this.cdr.markForCheck();
      }
    });
  }
}
