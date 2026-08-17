import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationItem, NotificationType } from '../../core/models/notification.model';
import {
  LucideAngularModule,
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  CheckCheck,
  Clock,
  Inbox,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-angular';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.css']
})
export class NotificationsPage implements OnInit {
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  // Expose icons for template
  readonly Bell = Bell;
  readonly Heart = Heart;
  readonly MessageSquare = MessageSquare;
  readonly UserPlus = UserPlus;
  readonly CheckCheck = CheckCheck;
  readonly Clock = Clock;
  readonly Inbox = Inbox;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly RefreshCw = RefreshCw;
  readonly Sparkles = Sparkles;
  readonly ExternalLink = ExternalLink;

  notifications = signal<NotificationItem[]>([]);
  isLoading = signal<boolean>(false);
  isMarkingAll = signal<boolean>(false);
  
  currentPage = signal<number>(1);
  pageSize = signal<number>(15);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);

  // Active filter tab: 'all' | 'unread' | 'like' | 'comment' | 'follow'
  activeFilter = signal<string>('all');

  // Filtered notifications
  filteredNotifications = computed(() => {
    const list = this.notifications();
    const filter = this.activeFilter();

    if (filter === 'all') return list;
    if (filter === 'unread') return list.filter((n) => !n.is_read);
    return list.filter((n) => n.type.toLowerCase() === filter);
  });

  unreadCount = this.notificationService.unreadCount;

  ngOnInit(): void {
    this.loadNotifications(1);
    this.notificationService.getUnreadCount().subscribe();
  }

  loadNotifications(page: number = 1): void {
    this.isLoading.set(true);
    this.currentPage.set(page);

    this.notificationService.getNotifications(page, this.pageSize()).subscribe({
      next: (res) => {
        this.notifications.set(res.items || []);
        this.totalPages.set(res.total_pages || 1);
        this.totalItems.set(res.total || 0);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
        this.isLoading.set(false);
      }
    });
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  markAsRead(item: NotificationItem, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (item.is_read) return;

    this.notificationService.markAsRead(item.id).subscribe({
      next: (updated) => {
        this.notifications.update((list) =>
          list.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
        );
      },
      error: (err) => console.error('Error marking as read:', err)
    });
  }

  markAllAsRead(): void {
    if (this.unreadCount() === 0 || this.isMarkingAll()) return;

    this.isMarkingAll.set(true);
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((n) => ({ ...n, is_read: true }))
        );
        this.isMarkingAll.set(false);
      },
      error: (err) => {
        console.error('Error marking all as read:', err);
        this.isMarkingAll.set(false);
      }
    });
  }

  onNotificationClick(item: NotificationItem): void {
    if (!item.is_read) {
      this.markAsRead(item);
    }

    if (item.post_id) {
      this.router.navigate(['/feed'], { queryParams: { post: item.post_id } });
    } else if (item.actor?.id) {
      this.router.navigate(['/profile']);
    }
  }

  getNotificationIcon(type: NotificationType) {
    switch (type.toLowerCase()) {
      case 'like':
        return this.Heart;
      case 'comment':
        return this.MessageSquare;
      case 'follow':
        return this.UserPlus;
      default:
        return this.Bell;
    }
  }

  getNotificationColorClass(type: NotificationType): string {
    switch (type.toLowerCase()) {
      case 'like':
        return 'text-rose-500 bg-rose-50 border-rose-200';
      case 'comment':
        return 'text-sky-500 bg-sky-50 border-sky-200';
      case 'follow':
        return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      default:
        return 'text-amber-500 bg-amber-50 border-amber-200';
    }
  }

  getNotificationActionText(item: NotificationItem): string {
    switch (item.type.toLowerCase()) {
      case 'like':
        return 'le dio me gusta a tu publicación';
      case 'comment':
        return 'comentó en tu publicación';
      case 'follow':
        return 'comenzó a seguirte';
      default:
        return 'ha interactuado contigo';
    }
  }

  formatTimeAgo(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hace un momento';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} d`;

    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  }
}
