import { Routes } from '@angular/router';
import { LoginPage } from './core/auth/login.page';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  {
    path: 'posts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/posts/posts.page').then((m) => m.PostsPage)
  },
  {
    path: 'sessions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sessions/sessions.page').then((m) => m.SessionsPage)
  },
  { path: '**', redirectTo: 'login' }
];


