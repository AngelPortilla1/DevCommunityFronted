export interface Post {
  id: number;
  title: string;
  content: string;
  author?: {
    id: number;
    name: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
