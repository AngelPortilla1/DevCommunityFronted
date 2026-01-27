import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#fdf6e3] p-4">
      
      <div class="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        
        <header class="text-center mb-10 border-b-4 border-black pb-4">
          <h1 class="text-4xl font-black uppercase tracking-tighter italic text-slate-900">
            DevCommunity
          </h1>
          <p class="text-xs font-mono uppercase mt-2 tracking-widest text-slate-500">
            Est. 2024 // Acceso restringido
          </p>
        </header>

        <form (submit)="submit()" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-black uppercase tracking-tight">Correo Electrónico:</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="user@archive.com"
              class="w-full border-4 border-black p-3 rounded-none focus:bg-yellow-50 outline-none transition-colors font-mono"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-black uppercase tracking-tight">Contraseña:</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="********"
              class="w-full border-4 border-black p-3 rounded-none focus:bg-yellow-50 outline-none transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:bg-blue-700"
          >
            Entrar al Sistema
          </button>
        </form>

        <div *ngIf="error" class="mt-6 bg-red-500 text-white border-2 border-black p-3 font-bold text-center animate-pulse">
          ⚠️ {{ error | uppercase }}
        </div>

        <footer class="mt-8 pt-4 border-t-2 border-dashed border-slate-300 text-center">
          <p class="text-[10px] font-mono text-slate-400 uppercase">
            Protocolo de seguridad v.2.0 activado
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

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: () => this.error = 'Credenciales incorrectas'
    });
  }
}