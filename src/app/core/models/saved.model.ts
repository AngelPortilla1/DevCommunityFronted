export interface SaveActionResponse {
  saved: boolean;
  message: string;
}

export interface SavedCheckResponse {
  is_saved: boolean;
  post_id: number;
}
