import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../models/notification.model';
import {
  ConversationListItem,
  Message,
  MessageSendBody,
  UnreadCountResponse,
  MarkReadResponse
} from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/messages`;

  // Reactive signal for unread message count across navbar, sidebar & pages
  unreadCount = signal<number>(0);

  /**
   * Fetches the number of unread messages and updates the reactive signal.
   */
  getUnreadCount(): Observable<UnreadCountResponse> {
    return this.http.get<UnreadCountResponse>(`${this.baseUrl}/unread-count`).pipe(
      tap((res) => {
        this.unreadCount.set(res.unread_count || 0);
      })
    );
  }

  /**
   * Lists all conversations for the authenticated user.
   */
  getConversations(): Observable<ConversationListItem[]> {
    return this.http.get<ConversationListItem[]>(`${this.baseUrl}/conversations`);
  }

  /**
   * Starts or retrieves an existing conversation with a given user.
   */
  startConversation(userId: number): Observable<ConversationListItem> {
    return this.http.post<ConversationListItem>(`${this.baseUrl}/conversations/${userId}`, {});
  }

  /**
   * Fetches paginated messages for a given conversation.
   */
  getMessages(conversationId: number, page: number = 1, size: number = 50): Observable<PaginatedResponse<Message>> {
    return this.http.get<PaginatedResponse<Message>>(`${this.baseUrl}/conversations/${conversationId}`, {
      params: { page, size }
    });
  }

  /**
   * Sends a message in a conversation.
   */
  sendMessage(conversationId: number, content: string): Observable<Message> {
    const body: MessageSendBody = { content };
    return this.http.post<Message>(`${this.baseUrl}/conversations/${conversationId}/send`, body);
  }

  /**
   * Marks all messages in a conversation as read.
   */
  markAsRead(conversationId: number): Observable<MarkReadResponse> {
    return this.http.patch<MarkReadResponse>(`${this.baseUrl}/conversations/${conversationId}/read`, {}).pipe(
      tap((res) => {
        this.unreadCount.update((count) => Math.max(0, count - res.marked_as_read));
      })
    );
  }
}
