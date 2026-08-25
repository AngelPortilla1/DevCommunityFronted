import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../core/services/message.service';
import { AuthService } from '../../core/auth/auth.service';
import { ConversationListItem, Message } from '../../core/models/message.model';
import {
  LucideAngularModule,
  MessageSquare,
  Send,
  Search,
  ArrowLeft,
  MoreVertical,
  CheckCheck,
  Clock,
  Inbox,
  UserPlus,
  RefreshCw,
  Smile,
  ChevronDown
} from 'lucide-angular';

@Component({
  selector: 'app-messages-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.css']
})
export class MessagesPage implements OnInit, OnDestroy, AfterViewChecked {
  private messageService = inject(MessageService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  // Lucide Icons
  readonly MessageSquare = MessageSquare;
  readonly Send = Send;
  readonly Search = Search;
  readonly ArrowLeft = ArrowLeft;
  readonly MoreVertical = MoreVertical;
  readonly CheckCheck = CheckCheck;
  readonly Clock = Clock;
  readonly Inbox = Inbox;
  readonly UserPlus = UserPlus;
  readonly RefreshCw = RefreshCw;
  readonly Smile = Smile;
  readonly ChevronDown = ChevronDown;

  // State
  conversations = signal<ConversationListItem[]>([]);
  loadingConversations = signal<boolean>(false);
  activeConversation = signal<ConversationListItem | null>(null);
  messages = signal<Message[]>([]);
  loadingMessages = signal<boolean>(false);
  sendingMessage = signal<boolean>(false);

  // New conversation
  showNewConversation = signal<boolean>(false);
  newConversationUserId = '';

  // Search
  searchTerm = signal<string>('');

  // Message input
  messageText = '';

  // Auto-scroll flag
  private shouldScrollToBottom = false;

  // Polling interval
  private pollingInterval: any = null;

  currentUserId = computed(() => this.auth.user()?.id ?? null);

  filteredConversations = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.conversations();
    if (!term) return list;
    return list.filter(
      (c) => c.other_user.username.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadConversations();
    this.messageService.getUnreadCount().subscribe();

    // Poll for new messages every 15 seconds
    this.pollingInterval = setInterval(() => {
      this.refreshActiveConversation();
      this.loadConversations(true);
    }, 15000);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadConversations(silent = false): void {
    if (!silent) this.loadingConversations.set(true);

    this.messageService.getConversations().subscribe({
      next: (convs) => {
        this.conversations.set(convs || []);
        this.loadingConversations.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading conversations:', err);
        this.loadingConversations.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  selectConversation(conv: ConversationListItem): void {
    this.activeConversation.set(conv);
    this.loadMessages(conv.id);

    // Mark as read if there are unread messages
    if (conv.unread_count > 0) {
      this.messageService.markAsRead(conv.id).subscribe({
        next: () => {
          this.conversations.update((list) =>
            list.map((c) => c.id === conv.id ? { ...c, unread_count: 0 } : c)
          );
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error marking as read:', err)
      });
    }
  }

  loadMessages(conversationId: number): void {
    this.loadingMessages.set(true);

    this.messageService.getMessages(conversationId).subscribe({
      next: (res) => {
        this.messages.set(res.items || []);
        this.loadingMessages.set(false);
        this.shouldScrollToBottom = true;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.loadingMessages.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  sendMessage(): void {
    const text = this.messageText.trim();
    const conv = this.activeConversation();
    if (!text || !conv || this.sendingMessage()) return;

    this.sendingMessage.set(true);

    this.messageService.sendMessage(conv.id, text).subscribe({
      next: (msg) => {
        this.messages.update((list) => [...list, msg]);
        this.messageText = '';
        this.sendingMessage.set(false);
        this.shouldScrollToBottom = true;

        // Update last message in conversations list
        this.conversations.update((list) =>
          list.map((c) => c.id === conv.id ? { ...c, last_message: msg } : c)
        );

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error sending message:', err);
        this.sendingMessage.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  startNewConversation(): void {
    const userId = parseInt(this.newConversationUserId, 10);
    if (isNaN(userId) || userId <= 0) return;

    this.messageService.startConversation(userId).subscribe({
      next: (conv) => {
        // Add to list if not already there
        this.conversations.update((list) => {
          const exists = list.find((c) => c.id === conv.id);
          if (!exists) return [conv, ...list];
          return list;
        });
        this.selectConversation(conv);
        this.showNewConversation.set(false);
        this.newConversationUserId = '';
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error starting conversation:', err);
        this.cdr.markForCheck();
      }
    });
  }

  goBackToList(): void {
    this.activeConversation.set(null);
    this.messages.set([]);
  }

  private refreshActiveConversation(): void {
    const conv = this.activeConversation();
    if (!conv) return;

    this.messageService.getMessages(conv.id).subscribe({
      next: (res) => {
        const current = this.messages();
        const newItems = res.items || [];
        if (newItems.length !== current.length) {
          this.messages.set(newItems);
          this.shouldScrollToBottom = true;
          this.cdr.markForCheck();
        }
      },
      error: () => {} // Silent fail on polling
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (_) {}
  }

  isOwnMessage(msg: Message): boolean {
    return msg.sender.id === this.currentUserId();
  }

  formatTimeAgo(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Ahora';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} d`;

    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  }

  formatMessageTime(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  trackByConvId(_: number, item: ConversationListItem): number {
    return item.id;
  }

  trackByMsgId(_: number, item: Message): number {
    return item.id;
  }
}
