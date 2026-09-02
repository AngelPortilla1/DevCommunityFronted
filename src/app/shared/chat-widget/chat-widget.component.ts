import {
  Component, OnInit, OnDestroy, inject, signal, computed,
  ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../core/services/message.service';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { ConversationListItem, Message } from '../../core/models/message.model';
import { UserPublic } from '../../core/models/notification.model';
import {
  LucideAngularModule,
  MessageSquare,
  Send,
  Search,
  X,
  ChevronDown,
  RefreshCw,
  CheckCheck,
  UserPlus,
  Smile,
  ArrowLeft,
  Minus
} from 'lucide-angular';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent implements OnInit, OnDestroy, AfterViewChecked {
  private messageService = inject(MessageService);
  private apiService = inject(ApiService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  // Icons
  readonly MessageSquare = MessageSquare;
  readonly Send = Send;
  readonly Search = Search;
  readonly X = X;
  readonly ChevronDown = ChevronDown;
  readonly RefreshCw = RefreshCw;
  readonly CheckCheck = CheckCheck;
  readonly UserPlus = UserPlus;
  readonly Smile = Smile;
  readonly ArrowLeft = ArrowLeft;
  readonly Minus = Minus;

  // Widget state
  isOpen = signal<boolean>(false);
  isChatOpen = signal<boolean>(false);
  isChatMinimized = signal<boolean>(false);

  // Data state
  conversations = signal<ConversationListItem[]>([]);
  loadingConversations = signal<boolean>(false);
  activeConversation = signal<ConversationListItem | null>(null);
  messages = signal<Message[]>([]);
  loadingMessages = signal<boolean>(false);
  sendingMessage = signal<boolean>(false);

  // New conversation search
  showNewConvSearch = signal<boolean>(false);
  userSearchQuery = '';
  userSearchResults = signal<UserPublic[]>([]);
  searchingUsers = signal<boolean>(false);
  private searchTimeout: any = null;

  // Conversation search
  searchTerm = signal<string>('');

  // Message input
  messageText = '';

  // Scroll
  private shouldScrollToBottom = false;

  // Polling
  private pollingInterval: any = null;

  // Unread count from service
  unreadCount = this.messageService.unreadCount;

  currentUserId = computed(() => this.auth.user()?.id ?? null);

  filteredConversations = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.conversations();
    if (!term) return list;
    return list.filter(c => c.other_user.username.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.loadConversations();
    this.pollingInterval = setInterval(() => {
      this.silentRefresh();
    }, 20000);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  // ─── Widget toggle ─────────────────────────────────────────────
  toggleWidget(): void {
    const opening = !this.isOpen();
    this.isOpen.set(opening);
    if (opening && this.conversations().length === 0) {
      this.loadConversations();
    }
  }

  closeWidget(): void {
    this.isOpen.set(false);
    this.isChatOpen.set(false);
    this.isChatMinimized.set(false);
    this.activeConversation.set(null);
    this.messages.set([]);
  }

  // ─── Conversations ──────────────────────────────────────────────
  loadConversations(silent = false): void {
    if (!silent) this.loadingConversations.set(true);

    this.messageService.getConversations().subscribe({
      next: (convs) => {
        this.conversations.set(convs || []);
        this.loadingConversations.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingConversations.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  selectConversation(conv: ConversationListItem): void {
    this.activeConversation.set(conv);
    this.isChatOpen.set(true);
    this.isChatMinimized.set(false);
    this.loadMessages(conv.id);

    if (conv.unread_count > 0) {
      this.messageService.markAsRead(conv.id).subscribe({
        next: () => {
          this.conversations.update(list =>
            list.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c)
          );
          this.cdr.markForCheck();
        },
        error: () => {}
      });
    }
  }

  // ─── Messages ──────────────────────────────────────────────────
  loadMessages(conversationId: number): void {
    this.loadingMessages.set(true);
    this.messageService.getMessages(conversationId).subscribe({
      next: (res) => {
        this.messages.set(res.items || []);
        this.loadingMessages.set(false);
        this.shouldScrollToBottom = true;
        this.cdr.markForCheck();
      },
      error: () => {
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
        this.messages.update(list => [...list, msg]);
        this.messageText = '';
        this.sendingMessage.set(false);
        this.shouldScrollToBottom = true;
        this.conversations.update(list =>
          list.map(c => c.id === conv.id ? { ...c, last_message: msg } : c)
        );
        this.cdr.markForCheck();
      },
      error: () => {
        this.sendingMessage.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  // ─── Chat window controls ──────────────────────────────────────
  closeChatWindow(): void {
    this.isChatOpen.set(false);
    this.isChatMinimized.set(false);
    this.activeConversation.set(null);
    this.messages.set([]);
    this.messageText = '';
  }

  toggleMinimize(): void {
    this.isChatMinimized.update(v => !v);
  }

  // ─── User search for new conversations ─────────────────────────
  toggleNewConvSearch(): void {
    this.showNewConvSearch.update(v => !v);
    if (!this.showNewConvSearch()) {
      this.userSearchQuery = '';
      this.userSearchResults.set([]);
    }
  }

  searchUsers(): void {
    const query = this.userSearchQuery.trim();
    if (query.length < 1) {
      this.userSearchResults.set([]);
      return;
    }
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchingUsers.set(true);
      this.apiService.searchUsers(query).subscribe({
        next: (users) => {
          this.userSearchResults.set(users);
          this.searchingUsers.set(false);
          this.cdr.markForCheck();
        },
        error: () => {
          this.searchingUsers.set(false);
          this.cdr.markForCheck();
        }
      });
    }, 300);
  }

  selectUserForConversation(user: UserPublic): void {
    this.messageService.startConversation(user.id).subscribe({
      next: (conv) => {
        this.conversations.update(list => {
          const exists = list.find(c => c.id === conv.id);
          if (!exists) return [conv, ...list];
          return list;
        });
        this.showNewConvSearch.set(false);
        this.userSearchQuery = '';
        this.userSearchResults.set([]);
        this.selectConversation(conv);
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────
  isOwnMessage(msg: Message): boolean {
    return msg.sender.id === this.currentUserId();
  }

  formatTimeAgo(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Ahora';
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d`;
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  }

  formatMessageTime(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  trackByConvId(_: number, item: ConversationListItem): number { return item.id; }
  trackByMsgId(_: number, item: Message): number { return item.id; }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (_) {}
  }

  private silentRefresh(): void {
    this.loadConversations(true);
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
      error: () => {}
    });
  }
}
