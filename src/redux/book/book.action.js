import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
import { GET_PROGRESS_FAILED, GET_PROGRESS_REQUEST, GET_PROGRESS_SUCCESS } from "../chapter/chapter.actionType";
import {
  ADD_NEW_LANGUAGE_FAILED,
  ADD_NEW_LANGUAGE_REQUEST,
  ADD_NEW_LANGUAGE_SUCCESS,
  BOOK_DELETE_FAILED,
  BOOK_DELETE_REQUEST,
  BOOK_DELETE_SUCCEED,
  BOOK_EDIT_FAILED,
  BOOK_EDIT_REQUEST,
  BOOK_EDIT_SUCCEED,
  BOOK_UPLOAD_FAILED,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_SUCCEED,
  DELETE_LANGUAGE_FAILED,
  DELETE_LANGUAGE_REQUEST,
  DELETE_LANGUAGE_SUCCESS,
  EDIT_LANGUAGE_FAILED,
  EDIT_LANGUAGE_REQUEST,
  EDIT_LANGUAGE_SUCCESS,
  FOLLOW_BOOK_FAILED,
  FOLLOW_BOOK_REQUEST,
  FOLLOW_BOOK_SUCCESS,
  GET_ALL_BOOK_FAILED,
  GET_ALL_BOOK_REQUEST,
  GET_ALL_BOOK_SUCCESS,
  GET_AVG_BOOK_RATING_FAILED,
  GET_AVG_BOOK_RATING_REQUEST,
  GET_AVG_BOOK_RATING_SUCCESS,
  GET_BOOK_FAILED,
  GET_BOOK_RATING_BY_USER_FAILED,
  GET_BOOK_RATING_BY_USER_REQUEST,
  GET_BOOK_RATING_BY_USER_SUCCESS,
  GET_BOOK_REQUEST,
  GET_BOOK_SUCCESS,
  GET_LANGUAGES_BY_BOOK_FAILED,
  GET_LANGUAGES_BY_BOOK_REQUEST,
  GET_LANGUAGES_BY_BOOK_SUCCESS,
  RATING_BOOK_FAILED,
  RATING_BOOK_REQUEST,
  RATING_BOOK_SUCCESS,
  SEARCH_BOOK_FAILED,
  SEARCH_BOOK_REQUEST,
  SEARCH_BOOK_SUCCESS,
} from "./book.actionType";

export const getAllBookAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books`);
    dispatch({ type: GET_ALL_BOOK_SUCCESS, payload: data });
    console.log("got all books: ", data);
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all books", error);
    dispatch({ type: GET_ALL_BOOK_FAILED, payload: error });
  }
};
export const getAllUserFollowingBookAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_ALL_BOOK_REQUEST });
  try {
    const { data } = await api.get(`/api/books/favoured/${userId}`);
    dispatch({ type: GET_ALL_BOOK_SUCCESS, payload: data });
    console.log("got all user favoured books: ", data);
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all user favoured books", error);
    dispatch({ type: GET_ALL_BOOK_FAILED, payload: error });
  }
};

export const getBookByIdAction = (bookId) => async (dispatch) => {
  console.log("Action getBookByIdAction dispatched");
  dispatch({ type: GET_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}`);
    console.log("Got book: ", data);
    dispatch({ type: GET_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error when trying to retreiving book: ", error);
    dispatch({ type: GET_BOOK_FAILED, payload: error.message });
  }
};

export const getReadingProgressByBookChaptersAndUser = (userId, chapters) => async (dispatch) => {
  console.log("Action getReadingProgressByBookChaptersAndUser dispatched");
  dispatch({ type: GET_PROGRESS_REQUEST });
  try {
    const readingProgresses = await Promise.all(
      chapters.map(async (chapter) => {
        const progressResponse = await api.get(`${API_BASE_URL}/api/reading-progress/${userId}/${chapter.id}`);
        return progressResponse.data;
      })
    );
    console.log("Got reading progresses", readingProgresses);
    dispatch({ type: GET_PROGRESS_SUCCESS, payload: readingProgresses });
    return { payload: readingProgresses };
  } catch (error) {
    console.log("Api error when trying to add new book: ", error);
    dispatch({ type: GET_PROGRESS_FAILED, payload: error.message });
  }
};

export const addNewBookAction = (bookData) => async (dispatch) => {
  console.log("Action addNewBookAction dispatched");
  dispatch({ type: BOOK_UPLOAD_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/translator/books`, bookData.data);
    console.log("New book added", data);
    dispatch({ type: BOOK_UPLOAD_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to add new book: ", error);
    dispatch({ type: BOOK_UPLOAD_FAILED, payload: error.message });
  }
};
export const editBookAction = (bookData) => async (dispatch) => {
  console.log("Action editBookAction dispatched with data: ", bookData.data);
  dispatch({ type: BOOK_EDIT_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/translator/books/${bookData.data.id}`, bookData.data);
    console.log("Book edited", response.data);
    dispatch({ type: BOOK_EDIT_SUCCEED, payload: response.data });
  } catch (error) {
    console.log("Api error when trying to edit book: ", error);
    dispatch({ type: BOOK_EDIT_FAILED, payload: error.message });
  }
};

export const deleteBookAction = (bookId) => async (dispatch) => {
  console.log("Action deleteBookAction dispatched");
  dispatch({ type: BOOK_DELETE_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/translator/books/${bookId}`);
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

export const searchBookAction = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_BOOK_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/books/search`, { params: { query } });
    dispatch({ type: SEARCH_BOOK_SUCCESS, payload: data });
    console.log("Found books: ", data);
    return { payload: data };
  } catch (error) {
    console.log("error", error);
    dispatch({ type: SEARCH_BOOK_FAILED, payload: error });
  }
};

export const ratingBookAction = (bookId, rating) => async (dispatch) => {
  console.log("Action ratingBookAction dispatched");
  dispatch({ type: RATING_BOOK_REQUEST });
  try {
    const { data } = await api.patch(`${API_BASE_URL}/api/books/rating/${bookId}`, { rating });
    console.log("Rated book", data);
    dispatch({ type: RATING_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to rating book: ", error);
    dispatch({ type: RATING_BOOK_FAILED, payload: error.message });
  }
};

export const getBookRatingByUserAction = (bookId) => async (dispatch) => {
  console.log("Action getBookRatingByUserAction dispatched");
  dispatch({ type: GET_BOOK_RATING_BY_USER_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/books/rating/${bookId}`);
    console.log("got book rating", data);
    dispatch({ type: GET_BOOK_RATING_BY_USER_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to rating book: ", error);
    dispatch({ type: GET_BOOK_RATING_BY_USER_FAILED, payload: error.message });
  }
};

export const getAvgBookRating = (bookId) => async (dispatch) => {
  console.log("Action getAvgBookRating dispatched");
  dispatch({ type: GET_AVG_BOOK_RATING_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/books/rating/average/${bookId}`);
    console.log("got avg book rating", data);
    dispatch({ type: GET_AVG_BOOK_RATING_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to rating book: ", error);
    dispatch({ type: GET_AVG_BOOK_RATING_FAILED, payload: error.message });
  }
};

export const getLanguagesByBook = (bookId) => async (dispatch) => {
  console.log("Action getLanguagesByBook dispatched");
  dispatch({ type: GET_LANGUAGES_BY_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/languages`);
    console.log("got book languages", data);
    dispatch({ type: GET_LANGUAGES_BY_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to get book languages: ", error);
    dispatch({ type: GET_LANGUAGES_BY_BOOK_FAILED, payload: error.message });
  }
};

export const getAllLanguages = () => async (dispatch) => {
  console.log("Action getAllLanguages dispatched");
  dispatch({ type: GET_LANGUAGES_BY_BOOK_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/admin/languages`);
    console.log("got all languages", data);
    dispatch({ type: GET_LANGUAGES_BY_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to get book languages: ", error);
    dispatch({ type: GET_LANGUAGES_BY_BOOK_FAILED, payload: error.message });
  }
};

export const addNewLanguage = (reqData) => async (dispatch) => {
  console.log("Action addNewLanguage dispatched with data: ", reqData.data);
  dispatch({ type: ADD_NEW_LANGUAGE_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/admin/languages`, reqData.data);
    console.log("added language", data);
    dispatch({ type: ADD_NEW_LANGUAGE_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to add language: ", error);
    dispatch({ type: ADD_NEW_LANGUAGE_FAILED, payload: error.message });
  }
};

export const editLanguageAction = (reqData) => async (dispatch) => {
  console.log("Action editLanguage dispatched with data: ", reqData.data);
  dispatch({ type: EDIT_LANGUAGE_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/admin/languages/${reqData.data.id}`, reqData.data);
    console.log("edited language", data);
    dispatch({ type: EDIT_LANGUAGE_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to edit language: ", error);
    dispatch({ type: EDIT_LANGUAGE_FAILED, payload: error.message });
  }
};

export const deleteLanguageAction = (langId) => async (dispatch) => {
  console.log("Action deleteLanguage dispatched with data: ", langId);
  dispatch({ type: DELETE_LANGUAGE_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/admin/languages/${langId}`);
    console.log("deleted language", data);
    dispatch({ type: DELETE_LANGUAGE_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to delete language: ", error);
    dispatch({ type: DELETE_LANGUAGE_FAILED, payload: error.message });
  }
};
