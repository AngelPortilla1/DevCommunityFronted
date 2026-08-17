import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.page').then(m => m.RegisterPage) },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'feed',
        loadComponent: () =>
          import('./features/posts/posts.page').then((m) => m.PostsPage)
      },
      {
        path: 'sessions',
        loadComponent: () =>
          import('./features/sessions/sessions.page').then((m) => m.SessionsPage)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.page').then((m) => m.ProfilePage)
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./features/explore/explore.page').then((m) => m.ExplorePage)
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications.page').then((m) => m.NotificationsPage)
      },
      {
        path: 'trending',
        loadComponent: () =>
          import('./features/trending/trending.page').then((m) => m.TrendingPage)
      },
      { path: '', redirectTo: 'feed', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
