import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SavedService } from '../../core/services/saved.service';
import { ApiService } from '../../core/services/api.service';
import { CommentService } from '../../core/services/comment.service';
import { AuthService } from '../../core/auth/auth.service';
import { Post } from '../../core/models/post.model';
import { PostComment } from '../../core/models/comment.model';
import {
  LucideAngularModule,
  Bookmark,
  BookmarkCheck,
  Heart,
  MessageSquare,
  Search,
  RefreshCw,
  Trash2,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Compass,
  Clock,
  ExternalLink,
  Send
} from 'lucide-angular';

@Component({
  selector: 'app-saved-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.css']
})
export class SavedPage implements OnInit {
  private savedService = inject(SavedService);
  private apiService = inject(ApiService);
  private commentService = inject(CommentService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // Lucide Icons
  readonly Bookmark = Bookmark;
  readonly BookmarkCheck = BookmarkCheck;
  readonly Heart = Heart;
  readonly MessageSquare = MessageSquare;
  readonly Search = Search;
  readonly RefreshCw = RefreshCw;
  readonly Trash2 = Trash2;
  readonly Share2 = Share2;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Sparkles = Sparkles;
  readonly Compass = Compass;
  readonly Clock = Clock;
  readonly ExternalLink = ExternalLink;
  readonly Send = Send;

  posts = signal<Post[]>([]);
  loading = signal<boolean>(false);
  searchTerm = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);

  // Unsave in-progress tracking
  unsavingPostId = signal<number | null>(null);

  // Comments state
  commentsMap: Record<number, PostComment[]> = {};
  loadingComments: Record<number, boolean> = {};
  commentsVisible: Record<number, boolean> = {};
  newCommentText: Record<number, string> = {};
  submittingComment: Record<number, boolean> = {};

  currentUserId = computed(() => this.auth.user()?.id ?? null);

  // Filtered posts based on search term
  filteredPosts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.posts();
    if (!term) return list;
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term) ||
        (p.author?.username && p.author.username.toLowerCase().includes(term))
    );
  });

  ngOnInit(): void {
    this.loadSavedPosts(1);
  }

  loadSavedPosts(page: number = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);

    this.savedService.getSavedPosts(page, this.pageSize()).subscribe({
      next: (res) => {
        // Mark all retrieved posts as saved
        const items = (res.items || []).map((p) => ({ ...p, is_saved: true }));
        this.posts.set(items);
        this.totalPages.set(res.total_pages || 1);
        this.totalItems.set(res.total || 0);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading saved posts:', err);
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  toggleSave(post: Post, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.unsavingPostId() === post.id) return;

    this.unsavingPostId.set(post.id);

    // If currently saved, unsave it and optimistically remove/update
    this.savedService.unsavePost(post.id).subscribe({
      next: () => {
        this.posts.update((list) => list.filter((p) => p.id !== post.id));
        this.totalItems.update((t) => Math.max(0, t - 1));
        this.unsavingPostId.set(null);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error removing from saved:', err);
        this.unsavingPostId.set(null);
        this.cdr.markForCheck();
      }
    });
  }

  // ── Likes ───────────────────────────────────────────────────
  toggleLike(post: Post, event?: MouseEvent): void {
    if (event) event.stopPropagation();

    if (post.liked_by_me) {
      this.apiService.unlikePost(post.id).subscribe({
        next: () => {
          post.liked_by_me = false;
          post.likes_count = Math.max(0, (post.likes_count || 1) - 1);
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error unliking post:', err)
      });
    } else {
      this.apiService.likePost(post.id).subscribe({
        next: () => {
          post.liked_by_me = true;
          post.likes_count = (post.likes_count || 0) + 1;
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error liking post:', err)
      });
    }
  }

  // ── Comentarios ─────────────────────────────────────────────
  toggleComments(postId: number, event?: MouseEvent): void {
    if (event) event.stopPropagation();

    this.commentsVisible[postId] = !this.commentsVisible[postId];

    if (this.commentsVisible[postId] && !this.commentsMap[postId]) {
      this.loadComments(postId);
    }
    this.cdr.markForCheck();
  }

  loadComments(postId: number): void {
    this.loadingComments[postId] = true;
    this.commentService.getCommentsByPost(postId).subscribe({
      next: (comments) => {
        this.commentsMap[postId] = comments;
        this.loadingComments[postId] = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.loadingComments[postId] = false;
        this.cdr.markForCheck();
      }
    });
  }

  addComment(postId: number): void {
    const text = (this.newCommentText[postId] || '').trim();
    if (!text || this.submittingComment[postId]) return;

    this.submittingComment[postId] = true;
    this.apiService.createComment(postId, text).subscribe({
      next: (comment) => {
        if (!this.commentsMap[postId]) {
          this.commentsMap[postId] = [];
        }
        this.commentsMap[postId].push(comment);
        this.newCommentText[postId] = '';
        this.submittingComment[postId] = false;

        // Update count on post
        const post = this.posts().find((p) => p.id === postId);
        if (post) {
          post.comments_count = (post.comments_count || 0) + 1;
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error creating comment:', err);
        this.submittingComment[postId] = false;
        this.cdr.markForCheck();
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
