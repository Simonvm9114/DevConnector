import axios from 'axios';
import {
  ADD_POST,
  GET_POSTS,
  GET_POST,
  POST_DELETED,
  POST_ERROR,
  UPDATE_LIKES,
  ADD_COMMENT,
  COMMENT_DELETED,
} from './types';
import { setAlert } from './alert';

export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/post');

    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getPost = (postId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/post/${postId}`);

    dispatch({ type: GET_POST, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addPost = (formData) => async (dispatch) => {
  const config = { headers: { 'Content-Type': 'application/json' } };

  try {
    const res = await axios.post('/api/post', formData, config);

    dispatch({ type: ADD_POST, payload: res.data });
    dispatch(setAlert('Post added successfully', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`/api/post/${postId}`);

    dispatch({ type: POST_DELETED, payload: postId });
    dispatch(setAlert('Post deleted successfully', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addComment = (postId, formData) => async (dispatch) => {
  const config = { headers: { 'Content-Type': 'application/json' } };

  try {
    const res = await axios.post(
      `/api/post/comment/${postId}`,
      formData,
      config
    );
    dispatch({ type: ADD_COMMENT, payload: res.data });
    dispatch(setAlert('Comment added successfully', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/post/comment/${postId}/${commentId}`);

    dispatch({ type: COMMENT_DELETED, payload: res.data });
    dispatch(setAlert('Comment deleted successfully', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/post/like/${postId}`);

    dispatch({ type: UPDATE_LIKES, payload: { postId, likes: res.data } });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/post/like/${postId}`);

    dispatch({ type: UPDATE_LIKES, payload: { postId, likes: res.data } });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
