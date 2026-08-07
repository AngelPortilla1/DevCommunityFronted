import { Component, ChangeDetectionStrategy } from '@angular/core';
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
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              autocomplete="current-password"
            />
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
      font-size: .78rem;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: .06em;
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
      transition: border-color .3s, box-shadow .3s;
      outline: none;
      box-sizing: border-box;
    }
    .input-wrapper input::placeholder { color: #94a3b8; }
    .input-wrapper input:focus {
      border-color: #059669;
      box-shadow: 0 0 0 3px rgba(5, 150, 105, .1);
    }
    .input-wrapper:focus-within .input-icon { color: #059669; }

    /* ── Submit button ── */
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
    .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(5,150,105,.2); }
    .submit-btn:hover::before { opacity: 1; }
    .submit-btn:active { transform: translateY(0) scale(.98); }
    .submit-btn:disabled { opacity: .7; cursor: not-allowed; transform: none; }

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
      background: #fff;
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
    .auth-link-text { color: #64748b; font-size: .9rem; margin: 0; }
    .auth-link { color: #059669; text-decoration: none; font-weight: 600; transition: color .2s; }
    .auth-link:hover { color: #fbbf24; }

    /* ── Error banner ── */
    .error-banner {
      margin-top: 1.25rem;
      display: flex;
      align-items: center;
      gap: .6rem;
      padding: .85rem 1rem;
      border-radius: 12px;
      background: #fef2f2;
      border: 1px solid #fee2e2;
      color: #b91c1c;
      font-size: .85rem;
      font-weight: 500;
      animation: shakeIn .4s ease;
    }
    .error-banner svg { width: 18px; height: 18px; flex-shrink: 0; color: #ef4444; }
    @keyframes shakeIn {
      0%, 100% { transform: translateX(0); }
      25%  { transform: translateX(-6px); }
      50%  { transform: translateX(5px); }
      75%  { transform: translateX(-3px); }
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
