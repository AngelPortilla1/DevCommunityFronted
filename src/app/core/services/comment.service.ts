import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.apiUrl}/comments/post/${postId}`
    );
  }
}
