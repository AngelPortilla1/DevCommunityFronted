import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-stone-50 p-4 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="fixed inset-0 pointer-events-none opacity-20"
        style="background-image: radial-gradient(#059669 1px, transparent 1px); background-size: 32px 32px;">
      </div>

      <div class="relative w-full max-w-md bg-white border-4 border-slate-900 shadow-[12px_12px_0px_#059669] p-10 rounded-3xl transform hover:-translate-y-1 transition-transform duration-300">
        
        <header class="text-center mb-10">
          <div class="inline-block bg-slate-900 text-white px-6 py-3 rounded-br-[2rem] shadow-[4px_4px_0px_#059669] mb-6">
            <h1 class="text-2xl font-black uppercase tracking-tighter leading-none">
              Dev<span class="text-emerald-400 font-serif italic lowercase">Community</span>
            </h1>
          </div>
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700 border-b-2 border-dashed border-emerald-200 pb-4 mx-10">
            Acceso al Sistema
          </p>
        </header>

        <form (submit)="submit()" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase text-slate-500 tracking-widest pl-1">Correo Electrónico</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="usuario@ejemplo.com"
              class="w-full bg-stone-50 border-2 border-slate-200 p-4 font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors rounded-lg placeholder-slate-400"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase text-slate-500 tracking-widest pl-1">Contraseña</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              class="w-full bg-stone-50 border-2 border-slate-200 p-4 font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors rounded-lg placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-emerald-700 text-white font-black uppercase py-4 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-lg hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-emerald-800 transition-all mt-4 tracking-widest"
          >
            Iniciar Sesión
          </button>
        </form>

        <div *ngIf="error" class="mt-8 bg-red-50 text-red-700 border-l-4 border-red-500 p-4 font-bold text-sm shadow-sm flex items-center gap-3">
          <span class="text-xl">⚠️</span> {{ error }}
        </div>

        <footer class="mt-8 text-center">
          <p class="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Secure_Login_v2.0 // {{ 2024 }}
          </p>
        </footer>
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