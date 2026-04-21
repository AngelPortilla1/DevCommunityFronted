import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ApiService } from '../../core/services/api.service';
import { Post } from '../../core/models/post.model';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.page.html'
})
export class ProfilePage implements OnInit {
  authService = inject(AuthService);
  apiService = inject(ApiService);
  
  user = this.authService.user;
  
  stats = signal({
    posts_count: 0,
    followers_count: 0,
    following_count: 0
  });

  recentPosts = signal<Post[]>([]);
  loading = signal(true);

  ngOnInit() {
    const currentUser = this.user();
    if (currentUser) {
      this.loadProfileData(currentUser.id);
    }
  }

  loadProfileData(userId: number) {
    this.apiService.getUserStats(userId).subscribe({
      next: (res) => this.stats.set(res),
      error: (err) => console.error('Error fetching stats', err)
    });

    this.apiService.getPostsByAuthor(userId, 1, 5).subscribe({
      next: (res) => {
        this.recentPosts.set(res.items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching posts', err);
        this.loading.set(false);
      }
    });
  }
}
