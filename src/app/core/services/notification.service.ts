import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  NotificationItem,
  NotificationUnreadCountResponse,
  NotificationReadAllResponse,
  PaginatedResponse
} from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/notifications`;

  // Signal for reactive unread notification count across navbar, sidebar & pages
  unreadCount = signal<number>(0);

  /**
   * Fetches the number of unread notifications and updates the reactive signal.
   */
  getUnreadCount(): Observable<NotificationUnreadCountResponse> {
    return this.http.get<NotificationUnreadCountResponse>(`${this.baseUrl}/unread-count`).pipe(
      tap((res) => {
        this.unreadCount.set(res.unread_count || 0);
      })
    );
  }

  /**
   * Lists paginated notifications for the current user.
   */
  getNotifications(page: number = 1, size: number = 15): Observable<PaginatedResponse<NotificationItem>> {
    return this.http.get<PaginatedResponse<NotificationItem>>(`${this.baseUrl}/`, {
      params: { page, size }
    });
  }

  /**
   * Marks a specific notification as read.
   */
  markAsRead(notificationId: number): Observable<NotificationItem> {
    return this.http.patch<NotificationItem>(`${this.baseUrl}/${notificationId}/read`, {}).pipe(
      tap(() => {
        this.unreadCount.update((count) => Math.max(0, count - 1));
      })
    );
  }

  /**
   * Marks all notifications as read.
   */
  markAllAsRead(): Observable<NotificationReadAllResponse> {
    return this.http.patch<NotificationReadAllResponse>(`${this.baseUrl}/read-all`, {}).pipe(
      tap(() => {
        this.unreadCount.set(0);
      })
    );
  }
}
