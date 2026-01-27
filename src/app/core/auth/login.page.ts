import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        (ngSubmit)="submit()"
        class="bg-white p-6 rounded shadow w-96 space-y-4"
      >
        <h1 class="text-xl font-bold text-center">DevCommunity</h1>

        <input
          type="email"
          [(ngModel)]="email"
          name="email"
          placeholder="Email"
          class="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          [(ngModel)]="password"
          name="password"
          placeholder="Password"
          class="w-full border p-2 rounded"
          required
        />

        <button
          class="w-full bg-black text-white py-2 rounded"
          [disabled]="loading"
        >
          {{ loading ? 'Entrando...' : 'Login' }}
        </button>

        <p *ngIf="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </p>
      </form>
    </div>
  `
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
    this.loading = true;
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/posts']);
      },
      error: () => {
        this.error = 'Credenciales inválidas';
        this.loading = false;
      }
    });
  }
}
