import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
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
      title="Crea tu cuenta"
      subtitle="Únete a nuestra comunidad de desarrolladores">

      <!-- Form -->
      <form (submit)="submit()" class="auth-form">

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
          @if (!isLoading) {
            <span>Registrarse</span>
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
          ¿Ya tienes una cuenta? <a routerLink="/login" class="auth-link">Inicia Sesión</a>
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

      <!-- Success banner -->
      @if (successMsg) {
        <div class="success-banner">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          {{ successMsg }}
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
      padding: .85rem 1rem .85rem 2.8rem;
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

    /* ── Error & Success banners ── */
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
      background: rgba(46, 20, 20, 0.8);
      border: 1px solid rgba(200, 90, 90, 0.35);
      color: #E07070;
    }
    .success-banner {
      background: rgba(20, 46, 30, 0.8);
      border: 1px solid rgba(76, 175, 130, 0.35);
      color: #4CAF82;
    }
    .error-banner svg { width: 18px; height: 18px; flex-shrink: 0; color: #E07070; }
    .success-banner svg { width: 18px; height: 18px; flex-shrink: 0; color: #4CAF82; }
    @keyframes shakeIn {
      0%, 100% { transform: translateX(0); }
      25%  { transform: translateX(-6px); }
      50%  { transform: translateX(5px); }
      75%  { transform: translateX(-3px); }
    }
  `]
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  error = '';
  successMsg = '';
  isLoading = false;

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
      next: () => {
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
