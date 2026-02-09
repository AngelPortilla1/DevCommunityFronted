import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Post, PostsResponse } from '../models/post.model';
import { PostComment } from '../models/comment.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  ;
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: any) {
    return this.http.get<T>(`${environment.apiUrl}${url}`, { params });
  }

  getPosts(page = 1, limit = 6) {
  return this.get<PostsResponse>(`/posts?page=${page}&limit=${limit}`);
}


  post<T>(url: string, body?: any) {
    return this.http.post<T>(`${environment.apiUrl}${url}`, body);
  }

  put<T>(url: string, body?: any) {
    return this.http.put<T>(`${environment.apiUrl}${url}`, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(`${environment.apiUrl}${url}`);
  }

  likePost(postId: number) {
  return this.http.post(`${environment.apiUrl}/posts/${postId}/like`, {});
}

unlikePost(postId: number) {
  return this.http.delete(`${environment.apiUrl}/posts/${postId}/like`);
}

createComment(postId: number, content: string) {
  return this.http.post<PostComment>(
    `${environment.apiUrl}/comments/${postId}`,
    { content }
  );
}


}
