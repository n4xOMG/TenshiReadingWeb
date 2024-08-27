import { DELETE_CHAPTER_FAILED, DELETE_CHAPTER_REQUEST } from "../chapter/chapter.actionType";
import {
  DELETE_USER_SUCCESS,
  GET_ALL_USERS_FAILED,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  SUSPEND_USER_FAILED,
  SUSPEND_USER_REQUEST,
  UNSUSPEND_USER_FAILED,
  UNSUSPEND_USER_REQUEST,
  UPDATE_USER_FAILED,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "./user.actionType";

const initialState = {
  jwt: null,
  error: null,
  user: null,
  users: [],
  loading: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USERS_REQUEST:
    case SUSPEND_USER_REQUEST:
    case UNSUSPEND_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_CHAPTER_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ALL_USERS_SUCCESS:
      return { ...state, loading: false, error: null, users: action.payload };
    case UPDATE_USER_SUCCESS:
      return { ...state, loading: false, error: null, user: action.payload };
    case DELETE_USER_SUCCESS:
      return { ...state, loading: false, error: null };

    case GET_ALL_USERS_FAILED:
    case SUSPEND_USER_FAILED:
    case UNSUSPEND_USER_FAILED:
    case UPDATE_USER_FAILED:
    case DELETE_CHAPTER_FAILED:
      return { ...state, loading: true, error: action.payload };
  }
};
