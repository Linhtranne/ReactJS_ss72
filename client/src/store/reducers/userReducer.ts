import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Post } from '../../interface/index';

interface PostsState {
  posts: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get('http://localhost:3001/posts');
  return response.data;
});

export const addPost = createAsyncThunk('posts/addPost', async (newPost: Omit<Post, 'id'>) => {
  const response = await axios.post('http://localhost:3001/posts', newPost);
  return response.data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    updatePostStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
      const post = state.posts.find(post => post.id === action.payload.id);
      if (post) {
        post.status = action.payload.status;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      });
  },
});

export const { updatePostStatus } = postsSlice.actions;

export default postsSlice.reducer;