import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * AuthCardComponent — Shell visual compartido para las páginas de autenticación.
 *
 * Identidad visual: "Retrofuturismo Hacker" · Titanio Metálico · Dark Premium
 * Encapsula todo el diseño glassmorphism oscuro (fondo, orbs, grid, tarjeta, logo,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="auth-universe">

      <!-- Ambient Background Orbs -->
      <div class="orb orb--titanium"></div>
      <div class="orb orb--steel"></div>
      <div class="orb orb--platinum"></div>

      <!-- Floating Code Symbols -->
      <span class="code-float code-float--1">{{ '{' }} {{ '}' }}</span>
      <span class="code-float code-float--2">&gt;_</span>
      <span class="code-float code-float--3">const</span>
      <span class="code-float code-float--4">=&gt;</span>
      <span class="code-float code-float--5">[ ]</span>
      <span class="code-float code-float--6">async</span>
      <span class="code-float code-float--7">npm</span>
      <span class="code-float code-float--8">git</span>

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
          DevCommunity &copy; 2026 &nbsp;·&nbsp; <span class="footer-mono">// build the future</span>
        </footer>

      </div>
    </div>
  `,
  styles: [`
    /* ── Import Google Fonts ── */
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :host {
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
    }

    /* ══════════════════════════════════
       UNIVERSE — Dark Hacker Backdrop
    ══════════════════════════════════ */
    .auth-universe {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0A0A0F;
      overflow: hidden;
      padding: 1.5rem;
    }

    /* ── Grid overlay — subtle titanium grid ── */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(136, 153, 170, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(136, 153, 170, 0.04) 1px, transparent 1px);
      background-size: 64px 64px;
      pointer-events: none;
    }

    /* ── Ambient Orbs — titanium tones ── */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(110px);
      pointer-events: none;
      animation: drift 14s ease-in-out infinite alternate;
    }
    .orb--titanium {
      width: 500px; height: 500px;
      background: rgba(85, 102, 119, 0.10);
      top: -12%; right: -6%;
      animation-delay: 0s;
    }
    .orb--steel {
      width: 420px; height: 420px;
      background: rgba(58, 74, 90, 0.12);
      bottom: -14%; left: -8%;
      animation-delay: -5s;
    }
    .orb--platinum {
      width: 320px; height: 320px;
      background: rgba(192, 200, 216, 0.05);
      top: 45%; left: 48%;
      transform: translate(-50%, -50%);
      animation-delay: -9s;
    }
    @keyframes drift {
      0%   { transform: translate(0, 0) scale(1); }
      50%  { transform: translate(30px, -20px) scale(1.07); }
      100% { transform: translate(-20px, 28px) scale(0.95); }
    }

    /* ── Floating Code Symbols ── */
    .code-float {
      position: absolute;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.8rem;
      font-weight: 500;
      color: rgba(136, 153, 170, 0.09);
      pointer-events: none;
      animation: floatUp 20s linear infinite;
      user-select: none;
    }
    .code-float--1 { left: 8%;  top: 90%; animation-duration: 22s; font-size: 1rem; }
    .code-float--2 { left: 18%; top: 95%; animation-duration: 26s; animation-delay: -4s; }
    .code-float--3 { left: 35%; top: 92%; animation-duration: 24s; animation-delay: -8s; font-size: 0.7rem; }
    .code-float--4 { left: 55%; top: 88%; animation-duration: 20s; animation-delay: -2s; }
    .code-float--5 { left: 72%; top: 93%; animation-duration: 28s; animation-delay: -11s; }
    .code-float--6 { left: 85%; top: 90%; animation-duration: 23s; animation-delay: -6s; }
    .code-float--7 { left: 45%; top: 96%; animation-duration: 29s; animation-delay: -14s; font-size: 0.65rem; }
    .code-float--8 { left: 62%; top: 91%; animation-duration: 25s; animation-delay: -9s; }

    @keyframes floatUp {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateY(-110vh) rotate(12deg); opacity: 0; }
    }

    /* ══════════════════════════════════
       AUTH CARD — Dark Glassmorphism
    ══════════════════════════════════ */
    .auth-card {
      position: relative;
      width: 100%;
      max-width: 420px;
      background: rgba(20, 20, 31, 0.78);
      backdrop-filter: blur(24px) saturate(1.5);
      -webkit-backdrop-filter: blur(24px) saturate(1.5);
      border: 1px solid rgba(136, 153, 170, 0.18);
      border-radius: 20px;
      padding: 2.5rem 2.25rem;
      z-index: 10;
      animation: cardIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
      box-shadow:
        0 0 0 1px rgba(136, 153, 170, 0.06),
        0 8px 32px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(192, 200, 216, 0.07);
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(24px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Glow ring behind card — metallic sheen */
    .card-glow {
      position: absolute;
      inset: -1px;
      border-radius: 21px;
      background: linear-gradient(135deg,
        rgba(192, 200, 216, 0.12) 0%,
        rgba(136, 153, 170, 0.08) 40%,
        rgba(58, 74, 90, 0.10) 100%);
      z-index: -1;
      filter: blur(2px);
      animation: glowPulse 5s ease-in-out infinite alternate;
    }
    @keyframes glowPulse {
      0%   { opacity: 0.3; }
      100% { opacity: 0.7; }
    }

    /* ── Logo ── */
    .logo-area {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }
    .logo-img {
      height: 3.25rem;
      width: auto;
      filter: drop-shadow(0 0 8px rgba(136, 153, 170, 0.25));
    }
    .logo-text {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #D0D8E8 0%, #8899AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Header ── */
    .card-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .card-title {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 1.6rem;
      font-weight: 700;
      color: #E8E8F0;
      letter-spacing: -0.03em;
      margin: 0 0 0.4rem;
    }
    .card-subtitle {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #556677;
      font-weight: 400;
      margin: 0;
    }

    /* ── Footer ── */
    .card-footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.7rem;
      color: #2E2E45;
      font-weight: 500;
      letter-spacing: 0.02em;
    }
    .footer-mono {
      font-family: 'JetBrains Mono', monospace;
      color: #3A4A5A;
    }

    /* ══════════════════════════════════
       RESPONSIVE
    ══════════════════════════════════ */
    @media (max-width: 480px) {
      .auth-card {
        padding: 2rem 1.5rem;
        border-radius: 16px;
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
