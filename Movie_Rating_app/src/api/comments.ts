import apiClient from './apiClient';

export interface MovieComment {
  id: string;
  userId: string;
  username: string;
  email: string;
  text: string;
  createdAt: string;
}

export interface CommentsResponse {
  status: string;
  data: {
    comments: MovieComment[];
  };
}

export interface CreateCommentData {
  text: string;
}

export const commentsAPI = {
  getByMovie: async (movieTmdbId: number): Promise<CommentsResponse> => {
    const response = await apiClient.get(`/movies/${movieTmdbId}/comments`);
    return response.data;
  },

  create: async (movieTmdbId: number, data: CreateCommentData): Promise<{ status: string; data: { comment: MovieComment } }> => {
    const response = await apiClient.post(`/movies/${movieTmdbId}/comments`, data);
    return response.data;
  }
};


