import { Component, inject, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ApiService } from '../../core/services/api.service';
import { Post } from '../../core/models/post.model';
import { LoggerService } from '../../core/services/logger.service';
import {
  LucideAngularModule,
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Settings,
  Plus,
  FileText,
  Users,
  UserCheck,
  Heart,
  MessageSquare,
  Bookmark,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Code2,
  Layers,
  Globe,
  Clock,
  ArrowRight,
  CheckCircle2,
  Flame
} from 'lucide-angular';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css']
})
export class ProfilePage implements OnInit {
  authService = inject(AuthService);
  apiService = inject(ApiService);
  private logger = inject(LoggerService);

  // Lucide Icons
  readonly UserIcon = UserIcon;
  readonly Mail = Mail;
  readonly Shield = Shield;
  readonly Calendar = Calendar;
  readonly Settings = Settings;
  readonly Plus = Plus;
  readonly FileText = FileText;
  readonly Users = Users;
  readonly UserCheck = UserCheck;
  readonly Heart = Heart;
  readonly MessageSquare = MessageSquare;
  readonly Bookmark = Bookmark;
  readonly ExternalLink = ExternalLink;
  readonly RefreshCw = RefreshCw;
  readonly Sparkles = Sparkles;
  readonly Code2 = Code2;
  readonly Layers = Layers;
  readonly Globe = Globe;
  readonly Clock = Clock;
  readonly ArrowRight = ArrowRight;
  readonly CheckCircle2 = CheckCircle2;
  readonly Flame = Flame;

  user = this.authService.user;

  stats = signal({
    posts_count: 0,
    followers_count: 0,
    following_count: 0
  });

  recentPosts = signal<Post[]>([]);
  loading = signal(true);
  isRefreshing = signal(false);
  activeTab = signal<'posts' | 'about'>('posts');

  totalLikesReceived = computed(() => {
    return this.recentPosts().reduce((acc, post) => acc + (post.likes_count || 0), 0);
  });

  ngOnInit() {
    const currentUser = this.user();
    if (currentUser) {
      this.loadProfileData(currentUser.id);
    }
  }

  loadProfileData(userId: number) {
    this.isRefreshing.set(true);

    this.apiService.getUserStats(userId).subscribe({
      next: (res) => this.stats.set(res),
      error: (err) => this.logger.error('Error fetching stats', err)
    });

    this.apiService.getPostsByAuthor(userId, 1, 10).subscribe({
      next: (res) => {
        this.recentPosts.set(res.items || []);
        this.loading.set(false);
        this.isRefreshing.set(false);
      },
      error: (err) => {
        this.logger.error('Error fetching posts', err);
        this.loading.set(false);
        this.isRefreshing.set(false);
      }
    });
  }

  refresh() {
    const currentUser = this.user();
    if (currentUser) {
      this.loadProfileData(currentUser.id);
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
