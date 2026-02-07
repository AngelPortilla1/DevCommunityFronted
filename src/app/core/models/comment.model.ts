export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    email: string;
  };
  created_at: string;
}
