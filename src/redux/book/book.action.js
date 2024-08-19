import { api, API_BASE_URL } from "../../api/api";
import {
  BOOK_DELETE_FAILED,
  BOOK_DELETE_REQUEST,
  BOOK_DELETE_SUCCEED,
  BOOK_EDIT_FAILED,
  BOOK_EDIT_REQUEST,
  BOOK_EDIT_SUCCEED,
  BOOK_UPLOAD_FAILED,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_SUCCEED,
  CREATE_COMMENT_FAILED,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  FOLLOW_BOOK_FAILED,
  FOLLOW_BOOK_REQUEST,
  FOLLOW_BOOK_SUCCESS,
  GET_ALL_BOOK_FAILED,
  GET_ALL_BOOK_REQUEST,
  GET_ALL_BOOK_SUCCESS,
  GET_BOOK_FAILED,
  GET_BOOK_REQUEST,
  GET_BOOK_SUCCESS,
  SEARCH_BOOK_FAILED,
  SEARCH_BOOK_REQUEST,
  SEARCH_BOOK_SUCCESS,
} from "./book.actionType";

export const getAllBookAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_BOOK_REQUEST });
  try {
    const { data } = await api.get("/api/books");
    dispatch({ type: GET_ALL_BOOK_SUCCESS, payload: data });
    console.log("got all books: ", data);
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all books", error);
    dispatch({ type: GET_ALL_BOOK_FAILED, payload: error });
  }
};
export const getBookByIdAction = (bookId) => async (dispatch) => {
  console.log("Action getBookByIdAction dispatched");
  dispatch({ type: GET_BOOK_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/books/${bookId}`);
    console.log("Got book: ", data);
    dispatch({ type: GET_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to retreiving book: ", error);
    dispatch({ type: GET_BOOK_FAILED, payload: error.message });
  }
};

export const addNewBookAction = (bookData) => async (dispatch) => {
  console.log("Action addNewBookAction dispatched");
  dispatch({ type: BOOK_UPLOAD_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/translator/books`, bookData.data);
    console.log("New book added", data);
    dispatch({ type: BOOK_UPLOAD_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to add new book: ", error);
    dispatch({ type: BOOK_UPLOAD_FAILED, payload: error.message });
  }
};
export const editBookAction = (bookData) => async (dispatch) => {
  console.log("Action editBookAction dispatched");
  dispatch({ type: BOOK_EDIT_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/translator/books/${bookData.bookId}`, bookData.data);
    console.log("Book edited", data);
    dispatch({ type: BOOK_EDIT_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to edit book: ", error);
    dispatch({ type: BOOK_EDIT_FAILED, payload: error.message });
  }
};

export const deleteBookAction = (bookId) => async (dispatch) => {
  console.log("Action deleteBookAction dispatched");
  dispatch({ type: BOOK_DELETE_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/api/translator/books/${bookId}`);
    console.log("Book deleted", data);
    dispatch({ type: BOOK_DELETE_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to delete book: ", error);
    dispatch({ type: BOOK_DELETE_FAILED, payload: error.message });
  }
};
export const followBookAction = (bookId) => async (dispatch) => {
  console.log("Action followBookAction dispatched");
  dispatch({ type: FOLLOW_BOOK_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/books/follow/${bookId}`);
    console.log("Followed book", data);
    dispatch({ type: FOLLOW_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to follow book: ", error);
    dispatch({ type: FOLLOW_BOOK_FAILED, payload: error.message });
  }
};
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

export const searchBookAction = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_BOOK_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/books/search`, { params: { query } });
    dispatch({ type: SEARCH_BOOK_SUCCESS, payload: data });
    console.log("Found books: ", data);
    return { payload: data };
  } catch (error) {
    console.log("error", error);
    dispatch({ type: SEARCH_BOOK_FAILED, payload: error });
  }
};
