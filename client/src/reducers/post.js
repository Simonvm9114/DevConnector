import {
  ADD_COMMENT,
  ADD_POST,
  COMMENT_DELETED,
  GET_POST,
  GET_POSTS,
  POST_DELETED,
  POST_ERROR,
  UPDATE_LIKES,
} from '../actions/types';

const initialState = {
  post: null,
  posts: [],
  loading: true,
  error: [],
};

const post = (state = initialState, actions) => {
  const { type, payload } = actions;

  switch (type) {
    case GET_POSTS:
      return { ...state, posts: payload, loading: false };
    case GET_POST:
      return { ...state, post: payload, loading: false };
    case ADD_POST:
      return { ...state, posts: [payload, ...state.posts], loading: false };
    case POST_DELETED:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload),
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        loading: false,
        posts: state.posts.map((post) =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
      };
    case ADD_COMMENT:
    case COMMENT_DELETED:
      return {
        ...state,
        loading: false,
        post: { ...state.post, comments: payload },
      };
    case POST_ERROR:
      return { ...state, error: payload, loading: false };
    default:
      return state;
  }
};

export default post;
