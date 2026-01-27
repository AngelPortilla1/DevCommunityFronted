import { Component, OnInit } from '@angular/core';
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
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getPosts().subscribe({
      next: (data: Post[]) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar los posts';
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }
}
