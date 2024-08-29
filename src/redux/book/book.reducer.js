import {
  BOOK_UPLOAD_FAILED,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_SUCCEED,
  CREATE_COMMENT_FAILED,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  FOLLOW_BOOK_FAILED,
  FOLLOW_BOOK_REQUEST,
  FOLLOW_BOOK_SUCCESS,
  GET_ALL_BOOK_COMMENT_FAILED,
  GET_ALL_BOOK_COMMENT_REQUEST,
  GET_ALL_BOOK_COMMENT_SUCCESS,
  GET_ALL_BOOK_FAILED,
  GET_ALL_BOOK_REQUEST,
  GET_ALL_BOOK_SUCCESS,
  GET_AVG_BOOK_RATING_REQUEST,
  GET_AVG_BOOK_RATING_SUCCESS,
  GET_BOOK_FAILED,
  GET_BOOK_RATING_BY_USER_REQUEST,
  GET_BOOK_RATING_BY_USER_SUCCESS,
  GET_BOOK_REQUEST,
  GET_BOOK_SUCCESS,
  RATING_BOOK_FAILED,
  RATING_BOOK_REQUEST,
  RATING_BOOK_SUCCESS,
  SEARCH_BOOK_FAILED,
  SEARCH_BOOK_REQUEST,
  SEARCH_BOOK_SUCCESS,
} from "./book.actionType";

const initialState = {
  jwt: null,
  error: null,
  book: null,
  books: [],
  comments: [],
  avgRating: [],
  rating: null,
  newComment: null,
  loading: false,
};

export const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOK_UPLOAD_REQUEST:
    case GET_BOOK_REQUEST:
    case GET_ALL_BOOK_REQUEST:
    case FOLLOW_BOOK_REQUEST:
    case RATING_BOOK_REQUEST:
    case CREATE_COMMENT_REQUEST:
    case SEARCH_BOOK_REQUEST:
    case GET_ALL_BOOK_COMMENT_REQUEST:
    case GET_BOOK_RATING_BY_USER_REQUEST:
    case GET_AVG_BOOK_RATING_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_BOOK_SUCCESS:
    case BOOK_UPLOAD_SUCCEED:
    case FOLLOW_BOOK_SUCCESS:
      return { ...state, loading: false, error: null, book: action.payload };

    case GET_ALL_BOOK_SUCCESS:
    case SEARCH_BOOK_SUCCESS:
      return { ...state, loading: false, error: null, books: action.payload };

    case GET_BOOK_RATING_BY_USER_SUCCESS:
    case RATING_BOOK_SUCCESS:
      return { ...state, loading: false, error: null, rating: action.payload };

    case GET_AVG_BOOK_RATING_SUCCESS:
      return { ...state, loading: false, error: null, avgRating: action.payload };
    case CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        newComment: action.payload,
        loading: false,
        error: null,
      };
    case GET_ALL_BOOK_COMMENT_SUCCESS:
      return {
        ...state,
        comments: action.payload,
        loading: false,
        error: null,
      };
    case BOOK_UPLOAD_FAILED:
    case GET_BOOK_FAILED:
    case GET_ALL_BOOK_FAILED:
    case FOLLOW_BOOK_FAILED:
    case RATING_BOOK_FAILED:
    case CREATE_COMMENT_FAILED:
    case SEARCH_BOOK_FAILED:
    case GET_ALL_BOOK_COMMENT_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
