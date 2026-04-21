import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.page.html'
})
export class ProfilePage {
  authService = inject(AuthService);
  user = this.authService.user;
  
  // Dummy data for the profile to look good
  stats = {
    posts: 12,
    followers: 248,
    following: 156
  };
}
