import { UserPublic } from './notification.model';

export interface MessageSender {
  id: number;
  username: string;
  avatar_url?: string | null;
}

export interface Message {
  id: number;
  content: string;
  sender: MessageSender;
  is_read: boolean;
  created_at: string;
}

export interface ConversationListItem {
  id: number;
  other_user: UserPublic;
  unread_count: number;
  last_message: Message | null;
  updated_at?: string;
}

export interface MessageSendBody {
  content: string;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkReadResponse {
  marked_as_read: number;
}
