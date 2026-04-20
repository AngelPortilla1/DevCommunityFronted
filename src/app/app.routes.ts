import { Routes } from '@angular/router';
import { LoginPage } from './core/auth/login.page';
import { authGuard } from './core/auth/auth.guard';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'posts',
        loadComponent: () =>
          import('./features/posts/posts.page').then((m) => m.PostsPage)
      },
      {
        path: 'sessions',
        loadComponent: () =>
          import('./features/sessions/sessions.page').then((m) => m.SessionsPage)
      },
      { path: '', redirectTo: 'posts', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
