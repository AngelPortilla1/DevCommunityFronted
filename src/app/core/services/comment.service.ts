import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostComment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  getCommentsByPost(postId: number): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(
      `${this.apiUrl}/comments/post/${postId}`
    );
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`);
  }

  updateComment(commentId: number, content: string): Observable<PostComment> {
    return this.http.put<PostComment>(`${this.apiUrl}/comments/${commentId}`, { content });
  }
}
