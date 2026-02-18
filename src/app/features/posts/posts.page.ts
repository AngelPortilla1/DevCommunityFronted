import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Post } from '../../core/models/post.model';
import { CommentService } from '../../core/services/comment.service';
import { PostComment } from '../../core/models/comment.model';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.css'],
})
export class PostsPage implements OnInit {
  posts: Post[] = [];
  loading = true;
  error: string | null = null;
  page = 1;
  limit = 6;
  total = 0;
  loadingMore = false;
  commentsMap: Record<number, PostComment[]> = {};
  loadingComments: Record<number, boolean> = {};
  commentsVisible: Record<number, boolean> = {};
  newComment: Record<number, string> = {};
  submittingComment: Record<number, boolean> = {};
  currentUserId: number | null = null;

  // ── Crear post ──────────────────────────────────────────────
  showCreateModal = false;
  newPost = { title: '', content: '' };
  creating = false;
  createError: string | null = null;

  // ── Editar post ──────────────────────────────────────────────
  showEditPostModal = false;
  editingPost: Post | null = null;
  editPostData = { title: '', content: '' };
  savingPost = false;
  editPostError: string | null = null;

  // ── Editar comentario (inline) ───────────────────────────────
  editingCommentId: number | null = null;
  editCommentContent: Record<number, string> = {};
  savingComment: Record<number, boolean> = {};

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private commentService: CommentService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.auth.user();
    console.log('User State:', user);
    if (user) {
      this.currentUserId = user.id;
    }
    this.loadPosts();
  }

  // ── Posts ────────────────────────────────────────────────────

  loadPosts(): void {
    this.loading = true;
    this.error = null;
    this.page = 1;

    this.apiService.getPosts(this.page, this.limit).subscribe({
      next: (res) => {
        this.posts = res.data || [];
        this.total = res.total;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.error = err.status === 401
          ? 'Token inválido o expirado. Por favor, inicia sesión de nuevo.'
          : 'Error al cargar los posts';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadMore(): void {
    if (this.posts.length >= this.total) return;
    this.loadingMore = true;
    this.page++;

    this.apiService.getPosts(this.page, this.limit).subscribe({
      next: (res) => {
        this.posts = [...this.posts, ...res.data];
        this.loadingMore = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingMore = false;
        this.cdr.markForCheck();
      }
    });
  }

  isPostAuthor(post: Post): boolean {
    return !!this.currentUserId && post.author?.id === this.currentUserId;
  }

  // ── Crear post ───────────────────────────────────────────────

  openCreateModal() {
    this.showCreateModal = true;
    this.createError = null;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.newPost = { title: '', content: '' };
  }

  createPost() {
    if (!this.newPost.title || !this.newPost.content) {
      this.createError = 'Todos los campos son obligatorios';
      return;
    }
    this.creating = true;

    this.apiService.post<Post>('/posts', this.newPost).subscribe({
      next: (post) => {
        this.posts.unshift(post);
        this.creating = false;
        this.closeCreateModal();
        this.cdr.markForCheck();
      },
      error: () => {
        this.createError = 'Error al crear el post';
        this.creating = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ── Editar post ──────────────────────────────────────────────

  openEditPostModal(post: Post) {
    this.editingPost = post;
    this.editPostData = { title: post.title, content: post.content };
    this.editPostError = null;
    this.showEditPostModal = true;
  }

  closeEditPostModal() {
    this.showEditPostModal = false;
    this.editingPost = null;
    this.editPostData = { title: '', content: '' };
  }

  savePost() {
    if (!this.editingPost) return;
    if (!this.editPostData.title || !this.editPostData.content) {
      this.editPostError = 'Todos los campos son obligatorios';
      return;
    }
    this.savingPost = true;

    this.apiService.updatePost(this.editingPost.id, this.editPostData).subscribe({
      next: (updated) => {
        const idx = this.posts.findIndex(p => p.id === updated.id);
        if (idx !== -1) {
          this.posts[idx] = { ...this.posts[idx], ...updated };
        }
        this.savingPost = false;
        this.closeEditPostModal();
        this.cdr.markForCheck();
      },
      error: () => {
        this.editPostError = 'Error al guardar los cambios';
        this.savingPost = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ── Eliminar post ────────────────────────────────────────────

  deletePost(post: Post) {
    if (!confirm(`¿Eliminar el post "${post.title}"?`)) return;

    this.apiService.deletePost(post.id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== post.id);
        this.total = Math.max(this.total - 1, 0);
        this.cdr.markForCheck();
      },
      error: () => alert('Error al eliminar el post')
    });
  }

  // ── Likes ────────────────────────────────────────────────────

  toggleLike(post: Post): void {
    if (post.liked_by_me) {
      this.unlike(post);
    } else {
      this.like(post);
    }
  }

  private like(post: Post): void {
    this.apiService.likePost(post.id).subscribe({
      next: () => {
        post.liked_by_me = true;
        post.likes_count = (post.likes_count || 0) + 1;
        this.cdr.markForCheck();
      },
      error: () => console.error('Error liking post')
    });
  }

  private unlike(post: Post): void {
    this.apiService.unlikePost(post.id).subscribe({
      next: () => {
        post.liked_by_me = false;
        post.likes_count = Math.max((post.likes_count || 1) - 1, 0);
        this.cdr.markForCheck();
      },
      error: () => console.error('Error unliking post')
    });
  }

  // ── Comentarios ──────────────────────────────────────────────

  loadComments(postId: number): void {
    this.loadingComments[postId] = true;

    this.commentService.getCommentsByPost(postId).subscribe({
      next: (comments) => {
        this.commentsMap[postId] = comments;
        this.loadingComments[postId] = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingComments[postId] = false;
      }
    });
  }

  toggleComments(postId: number): void {
    if (!this.commentsMap[postId]) {
      this.loadComments(postId);
    }
    this.commentsVisible[postId] = !this.commentsVisible[postId];
  }

  createComment(postId: number): void {
    const content = this.newComment[postId]?.trim();
    if (!content) return;

    this.submittingComment[postId] = true;

    this.apiService.createComment(postId, content).subscribe({
      next: (comment: PostComment) => {
        if (!this.commentsMap[postId]) {
          this.commentsMap[postId] = [];
        }
        this.commentsMap[postId].push(comment);
        this.newComment[postId] = '';
        this.submittingComment[postId] = false;
        this.cdr.markForCheck();
      },
      error: () => {
        alert('Error al crear comentario');
        this.submittingComment[postId] = false;
      }
    });
  }

  isCommentAuthor(comment: PostComment): boolean {
    return !!this.currentUserId && comment.author?.id === this.currentUserId;
  }

  // ── Editar comentario ────────────────────────────────────────

  startEditComment(comment: PostComment) {
    this.editingCommentId = comment.id;
    this.editCommentContent[comment.id] = comment.content;
  }

  cancelEditComment() {
    this.editingCommentId = null;
  }

  saveComment(postId: number, comment: PostComment) {
    const content = this.editCommentContent[comment.id]?.trim();
    if (!content) return;

    this.savingComment[comment.id] = true;

    this.commentService.updateComment(comment.id, content).subscribe({
      next: (updated) => {
        const list = this.commentsMap[postId];
        const idx = list.findIndex(c => c.id === comment.id);
        if (idx !== -1) list[idx] = updated;
        this.editingCommentId = null;
        this.savingComment[comment.id] = false;
        this.cdr.markForCheck();
      },
      error: () => {
        alert('Error al guardar el comentario');
        this.savingComment[comment.id] = false;
      }
    });
  }

  // ── Eliminar comentario ──────────────────────────────────────

  deleteComment(postId: number, commentId: number) {
    if (!confirm('¿Eliminar este comentario?')) return;

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.commentsMap[postId] = this.commentsMap[postId].filter(c => c.id !== commentId);
        this.cdr.markForCheck();
      },
      error: () => alert('Error al eliminar el comentario')
    });
  }
}
