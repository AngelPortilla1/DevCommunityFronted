export interface UserPublic {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
  role?: string;
}

export interface PaginatedResponse<T> {
  page: number;
  size: number;
  total: number;
  total_pages: number;
  items: T[];
}

export type NotificationType = 'like' | 'comment' | 'follow' | string;

export interface NotificationItem {
  id: number;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  post_id?: number | null;
  post_title?: string | null;
  actor: UserPublic;
}

export interface NotificationUnreadCountResponse {
  unread_count: number;
}

export interface NotificationReadAllResponse {
  marked_as_read: number;
  message: string;
}
