import { Routes } from '@angular/router';
import { LoginPage } from './core/auth/login.page';
import { authGuard } from './core/auth/auth.guard';



export const routes: Routes = [
     { path: 'login', component: LoginPage },
  {
    path: 'posts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/posts/posts.page.js').then((m) => m.PostsPage)
  },
  { path: '**', redirectTo: 'login' }
];


