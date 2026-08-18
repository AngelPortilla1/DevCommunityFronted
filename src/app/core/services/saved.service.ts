import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SaveActionResponse, SavedCheckResponse } from '../models/saved.model';
import { PaginatedResponse } from '../models/notification.model';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class SavedService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/saved`;

  // Reactive signal for total saved count in UI
  savedCount = signal<number>(0);

  /**
   * Saves a post to the user's bookmarks.
   */
  savePost(postId: number): Observable<SaveActionResponse> {
    return this.http.post<SaveActionResponse>(`${this.baseUrl}/${postId}`, {}).pipe(
      tap(() => {
        this.savedCount.update((c) => c + 1);
      })
    );
  }

  /**
   * Removes a post from the user's bookmarks.
   */
  unsavePost(postId: number): Observable<SaveActionResponse> {
    return this.http.delete<SaveActionResponse>(`${this.baseUrl}/${postId}`).pipe(
      tap(() => {
        this.savedCount.update((c) => Math.max(0, c - 1));
      })
    );
  }

  /**
   * Checks if a specific post is saved by the current user.
   */
  checkSaved(postId: number): Observable<SavedCheckResponse> {
    return this.http.get<SavedCheckResponse>(`${this.baseUrl}/${postId}/check`);
  }

  /**
   * Lists paginated saved posts of the current user.
   */
  getSavedPosts(page: number = 1, size: number = 10): Observable<PaginatedResponse<Post>> {
    return this.http.get<PaginatedResponse<Post>>(`${this.baseUrl}/`, {
      params: { page, size }
    }).pipe(
      tap((res) => {
        this.savedCount.set(res.total || 0);
      })
    );
  }
}
