import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col md:flex-row bg-white relative overflow-hidden font-sans">

      <!-- Left Section (Branding - Clean & Minimalist) -->
<div class="hidden md:flex flex-col justify-center px-20 bg-slate-900 md:w-[45%] 
            relative rounded-r-[80px] overflow-hidden z-10">

  <!-- Soft right fade to avoid hard edge -->
  <div class="absolute top-0 right-0 h-full w-32 bg-gradient-to-r 
              from-transparent to-white/40 pointer-events-none"></div>

  <!-- Subtle Background Glow -->
  <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
  <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>

  <div class="relative z-10">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide uppercase mb-8">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      DevCommunity 2026
    </div>

    <h1 class="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
      Conecta con otros <br/>
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">desarrolladores.</span>
    </h1>

    <p class="mt-6 text-lg text-slate-400 max-w-md font-light leading-relaxed">
      La plataforma donde las ideas crecen, el código se comparte y el futuro se construye en equipo.
    </p>

    <div class="mt-12 p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 text-slate-300 max-w-sm">
      <div class="flex gap-2 mb-4">
        <div class="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
      </div>
      <p class="font-mono text-sm text-emerald-400 font-medium">~/dev-community $ npm start</p>
      <p class="font-mono text-sm mt-2 text-slate-400">Iniciando sistema de networking...</p>
      <p class="font-mono text-sm mt-1 text-slate-400">Cargando repositorios...</p>
      <p class="font-mono text-sm mt-2 text-emerald-400">Estado: Online ⚡</p>
    </div>
  </div>

</div>

      <!-- Right Section (Login Form - Clean) -->
      <div class="flex-1 flex items-center justify-center p-8 relative bg-white z-0">

        <!-- Optional soft dotted background -->
        <div class="fixed inset-0 pointer-events-none opacity-[0.03]"
          style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 24px 24px;">
        </div>

        <div class="relative w-full max-w-sm">
          
          <!-- Header -->
          <header class="mb-10 text-center">
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight mb-2">Bienvenido</h1>
            <p class="text-slate-500 font-medium">Ingresa tus credenciales para continuar</p>
          </header>

          <!-- Form -->
          <form (submit)="submit()" class="space-y-5">

            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="usuario@ejemplo.com"
                class="w-full bg-white border border-slate-200 px-4 py-3 text-slate-900 
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
                       transition-all rounded-xl placeholder-slate-400"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">
                Contraseña
              </label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                class="w-full bg-white border border-slate-200 px-4 py-3 text-slate-900 
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
                       transition-all rounded-xl placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-emerald-600 text-white font-semibold py-3 
                     rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20 
                     active:scale-[0.98] transition-all mt-6"
            >
              Iniciar Sesión
            </button>
          </form>

          <!-- Error -->
          <div *ngIf="error" class="mt-6 bg-red-50 text-red-600 border border-red-100 
                                    p-4 rounded-xl font-medium text-sm flex items-center gap-3">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ error }}
          </div>

          <!-- Footer -->
          <footer class="mt-12 text-center">
            <p class="text-xs text-slate-400 font-medium">
              DevCommunity © {{ 2026 }}
            </p>
          </footer>
        </div>
      </div>

    </div>
  `
})
export class LoginPage {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  submit() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: () => this.error = 'Credenciales incorrectas'
    });
  }
}