import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
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
  GET_ALL_BOOK_COMMENT_FAILED,
  GET_ALL_BOOK_COMMENT_REQUEST,
  GET_ALL_BOOK_COMMENT_SUCCESS,
  GET_ALL_SENSITIVE_WORDS_FAILED,
  GET_ALL_SENSITIVE_WORDS_REQUEST,
  GET_ALL_SENSITIVE_WORDS_SUCCESS,
} from "./comment.actionType";

export const createCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_COMMENT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/books/${reqData.bookId}/comments`, reqData.data);
    dispatch({ type: CREATE_COMMENT_SUCCESS, payload: data });
    console.log("created comment: ", data);
  } catch (error) {
    console.log("error", error);
    dispatch({ type: CREATE_COMMENT_FAILED, payload: error });
  }
};

export const deleteCommentAction = (commentId) => async (dispatch) => {
  dispatch({ type: DELETE_COMMENT_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/comments/${commentId}`);
    dispatch({ type: DELETE_COMMENT_SUCCESS, payload: data });
    console.log("deleted comment: ", data);
  } catch (error) {
    console.log("error", error);
    dispatch({ type: DELETE_COMMENT_FAILED, payload: error });
  }
};

export const getAllCommentByBookAction = (bookId) => async (dispatch) => {
  dispatch({ type: GET_ALL_BOOK_COMMENT_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/comments`);
    dispatch({ type: GET_ALL_BOOK_COMMENT_SUCCESS, payload: data });
    console.log("got all book comment: ", data);
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all book comment", error);
    dispatch({ type: GET_ALL_BOOK_COMMENT_FAILED, payload: error });
  }
};

export const getAllSensitiveWord = () => async (dispatch) => {
  dispatch({ type: GET_ALL_SENSITIVE_WORDS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/translator/sensitive-words`);
    dispatch({ type: GET_ALL_SENSITIVE_WORDS_SUCCESS, payload: data });
    console.log("got words: ", data);
  } catch (error) {
    console.log("error", error);
    dispatch({ type: GET_ALL_SENSITIVE_WORDS_FAILED, payload: error });
  }
};

export const addNewSensitiveWord = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_SENSITIVE_WORD_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/translator/sensitive-words`, reqData.data);
    dispatch({ type: ADD_SENSITIVE_WORD_SUCCESS, payload: data });
    console.log("created comment: ", data);
  } catch (error) {
    console.log("error", error);
    dispatch({ type: ADD_SENSITIVE_WORD_FAILED, payload: error });
  }
};

export const deleteSensitiveWord = (wordId) => async (dispatch) => {
  dispatch({ type: ADD_SENSITIVE_WORD_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/translator/sensitive-words/${wordId}`);
    dispatch({ type: ADD_SENSITIVE_WORD_SUCCESS, payload: data });
    console.log("created comment: ", data);
  } catch (error) {
    console.log("error", error);
    dispatch({ type: ADD_SENSITIVE_WORD_FAILED, payload: error });
  }
};
