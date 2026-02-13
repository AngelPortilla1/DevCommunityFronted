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
  currentUserId!: number;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private commentService: CommentService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    console.log('User State:', this.auth.user());
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;
    this.page = 1;

    this.apiService.getPosts(this.page, this.limit).subscribe({
      next: (res) => {
        console.log('Posts response:', res);
        console.log('Posts loaded:', res.data.length);

        this.posts = res.data || [];
        this.total = res.total;

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Error loading posts:', err);
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
      error: () => {
        console.error('Error liking post');
      }
    });
  }

  private unlike(post: Post): void {
    this.apiService.unlikePost(post.id).subscribe({
      next: () => {
        post.liked_by_me = false;
        post.likes_count = Math.max((post.likes_count || 1) - 1, 0);
        this.cdr.markForCheck();
      },
      error: () => {
        console.error('Error unliking post');
      }
    });
  }
  showCreateModal = false;

  newPost = {
    title: '',
    content: ''
  };

  creating = false;
  createError: string | null = null;


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

        // Asegurar que existe el array antes de usarlo
        if (!this.commentsMap[postId]) {
          this.commentsMap[postId] = [];
        }

        this.commentsMap[postId].push(comment);

        this.newComment[postId] = '';
        this.submittingComment[postId] = false;
      },
      error: () => {
        alert('Error al crear comentario');
        this.submittingComment[postId] = false;
      }
    });
  }




}
