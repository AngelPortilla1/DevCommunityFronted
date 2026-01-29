import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Post } from '../../core/models/post.model';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.css']
})
export class PostsPage implements OnInit {
  posts: Post[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;


    // ********************  VERIFICAR RESPUESTA DEL POST RESPONSE ********************** 

    //console.log('Loading posts...');
    this.apiService.getPosts().subscribe({
      next: (data: Post[]) => {
        console.log('Posts loaded successfully:', data);
        console.log('Data length:', data?.length);
        this.posts = data || [];
        this.loading = false;
        //console.log('Assigned posts to component:', this.posts);
        console.log('Component posts length:', this.posts.length);
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

}
