import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router, RouterLinkActive } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  LucideAngularModule,
  Home,
  Compass,
  Bell,
  Bookmark,
  TrendingUp,
  User as UserIcon,
  Settings,
  Hash,
  MessageSquare,
  FileText,
  ShieldCheck,
  LogOut,
  Search,
  Menu
} from 'lucide-angular';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  // Expose icons to template
  readonly Home = Home;
  readonly Compass = Compass;
  readonly Bell = Bell;
  readonly Bookmark = Bookmark;
  readonly TrendingUp = TrendingUp;
  readonly UserIcon = UserIcon;
  readonly Settings = Settings;
  readonly Hash = Hash;
  readonly MessageSquare = MessageSquare;
  readonly FileText = FileText;
  readonly ShieldCheck = ShieldCheck;
  readonly LogOut = LogOut;
  readonly Search = Search;
  readonly Menu = Menu;

  isProfileMenuOpen = false;
  isMobileMenuOpen = false;

  user = this.authService.user;
  unreadNotificationsCount = this.notificationService.unreadCount;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.notificationService.getUnreadCount().subscribe({
        error: (err) => console.error('Error getting notification count:', err)
      });
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navItems = [
    { label: 'INICIO', icon: this.Home, route: '/feed' },
    { label: 'EXPLORAR', icon: this.Compass, route: '/explore' },
    { label: 'NOTIFICACIONES', icon: this.Bell, route: '/notifications', badge: () => this.unreadNotificationsCount() },
    { label: 'GUARDADOS', icon: this.Bookmark, route: '/saved' },
    { label: 'TENDENCIAS', icon: this.TrendingUp, route: '/trending' },
    { label: 'MENSAJES', icon: this.MessageSquare, route: '/feed' },
    { label: 'PERFIL', icon: this.UserIcon, route: '/profile' },
    { label: 'AJUSTES', icon: this.Settings, route: '/sessions' },
  ];

  trendingTopics = [
    '# AI_ETHICS',
    '# ANGULAR_TIPS',
    '# FASTAPI_TIPS',
    '# FASTAPI_DEV',
    '# ROSE_50',
    '# ROSE_9',
  ];

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
