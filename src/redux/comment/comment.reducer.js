import {
  ADD_SENSITIVE_WORD_FAILED,
  ADD_SENSITIVE_WORD_REQUEST,
  ADD_SENSITIVE_WORD_SUCCESS,
  CREATE_COMMENT_FAILED,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILED,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_SENSITIVE_WORD_FAILED,
  DELETE_SENSITIVE_WORD_REQUEST,
  DELETE_SENSITIVE_WORD_SUCCESS,
  GET_ALL_BOOK_COMMENT_FAILED,
  GET_ALL_BOOK_COMMENT_REQUEST,
  GET_ALL_BOOK_COMMENT_SUCCESS,
  GET_ALL_SENSITIVE_WORDS_FAILED,
  GET_ALL_SENSITIVE_WORDS_REQUEST,
  GET_ALL_SENSITIVE_WORDS_SUCCESS,
} from "./comment.actionType";

const initialState = {
  jwt: null,
  error: null,
  comments: [],
  newComment: null,
  sensitiveWords: [],
  newSensitiveWord: null,
  loading: false,
};

export const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BOOK_COMMENT_REQUEST:
    case GET_ALL_SENSITIVE_WORDS_REQUEST:
    case CREATE_COMMENT_REQUEST:
    case DELETE_COMMENT_REQUEST:
    case ADD_SENSITIVE_WORD_REQUEST:
    case DELETE_SENSITIVE_WORD_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_ALL_BOOK_COMMENT_SUCCESS:
      return {
        ...state,
        comments: action.payload,
        loading: false,
        error: null,
      };

    case GET_ALL_SENSITIVE_WORDS_SUCCESS:
      return { ...state, loading: false, error: null, sensitiveWords: action.payload };

    case CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        newComment: action.payload,
        loading: false,
        error: null,
      };

    case ADD_SENSITIVE_WORD_SUCCESS:
      return { ...state, loading: false, error: null, newSensitiveWord: action.payload };
    case DELETE_SENSITIVE_WORD_SUCCESS:
    case DELETE_COMMENT_SUCCESS:
      return { ...state, loading: false, error: null };

    case GET_ALL_BOOK_COMMENT_FAILED:
    case GET_ALL_SENSITIVE_WORDS_FAILED:
    case CREATE_COMMENT_FAILED:
    case DELETE_COMMENT_FAILED:
    case ADD_SENSITIVE_WORD_FAILED:
    case DELETE_SENSITIVE_WORD_FAILED:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
