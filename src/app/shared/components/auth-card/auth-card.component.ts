import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * AuthCardComponent — Shell visual compartido para las páginas de autenticación.
 *
 * Encapsula todo el diseño glassmorphism (fondo, orbs, grid, tarjeta, logo,
 * header y footer). Cada página inyecta su contenido específico vía ng-content.
 *
 * @example
 * <app-auth-card title="Bienvenido de vuelta" subtitle="Ingresa a tu cuenta">
 *   <form>...</form>
 * </app-auth-card>
 */
@Component({
  selector: 'app-auth-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-universe">

      <!-- Ambient Background Orbs -->
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

      <!-- Auth Card -->
      <div class="auth-card">

        <!-- Glow ring -->
        <div class="card-glow"></div>

        <!-- Logo -->
        <div class="logo-area">
          <img src="assets/LogoDevCommunity.png" alt="DevCommunity Logo" class="logo-img">
          <span class="logo-text">DevCommunity</span>
        </div>

        <!-- Heading (customizable via @Input) -->
        <header class="card-header">
          <h1 class="card-title">{{ title }}</h1>
          <p class="card-subtitle">{{ subtitle }}</p>
        </header>

        <!-- Page-specific content (form, links, banners) -->
        <ng-content></ng-content>

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
    .auth-universe {
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
       AUTH CARD  (glassmorphism light)
    ══════════════════════════════════ */
    .auth-card {
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
    .logo-img {
      height: 4rem;
      width: auto;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,.1));
    }
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
      .auth-card {
        padding: 2rem 1.5rem;
        border-radius: 20px;
      }
      .card-title { font-size: 1.4rem; }
      .code-float { display: none; }
    }
  `]
})
export class AuthCardComponent {
  /** Título principal de la tarjeta (h1). */
  @Input() title = '';
  /** Subtítulo descriptivo bajo el título. */
  @Input() subtitle = '';
}
