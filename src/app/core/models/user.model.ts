export interface User {
  id: number;
  username: string;
  email: string;
  role?: 'user' | 'admin';
  bio?: string;
  specialty?: string;
  skills?: string[];
  avatar_url?: string;
}

