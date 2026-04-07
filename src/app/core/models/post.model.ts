export interface Post {
  id: number;
  title: string;
  content: string;
  author?: {
    id: number;
    username: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string | null;
  likes_count?: number;
  liked_by_me?: boolean;
}

export interface PostsResponse {
  page: number;
  limit?: number; // Depending on frontend usage, might also be `size` in backend
  size?: number;
  total: number;
  total_pages?: number;
  items: Post[];
}
