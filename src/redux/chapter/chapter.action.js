import { api, API_BASE_URL } from "../../api/api";
import {
  CHAPTER_UPLOAD_FAILED,
  CHAPTER_UPLOAD_REQUEST,
  CHAPTER_UPLOAD_SUCCEED,
  DELETE_CHAPTER_FAILED,
  DELETE_CHAPTER_REQUEST,
  DELETE_CHAPTER_SUCCEED,
  EDIT_CHAPTER_FAILED,
  EDIT_CHAPTER_REQUEST,
  EDIT_CHAPTER_SUCCEED,
  GET_ALL_CHAPTER_FAILED,
  GET_ALL_CHAPTER_REQUEST,
  GET_ALL_CHAPTER_SUCCESS,
  GET_CHAPTER_FAILED,
  GET_CHAPTER_REQUEST,
  GET_CHAPTER_SUCCESS,
  GET_PROGRESS_FAILED,
  GET_PROGRESS_REQUEST,
  GET_PROGRESS_SUCCESS,
  SAVE_PROGRESS_FAILED,
  SAVE_PROGRESS_REQUEST,
  SAVE_PROGRESS_SUCCESS,
} from "./chapter.actionType";

export const getAllChaptersByBookIdAction = (bookId) => async (dispatch) => {
  dispatch({ type: GET_ALL_CHAPTER_REQUEST });
  console.log("Action getAllChaptersByBookIdAction dispatched");
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/books/${bookId}/chapters`);
    console.log("Got chapters: ", data);
    dispatch({ type: GET_ALL_CHAPTER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_ALL_CHAPTER_FAILED, payload: error.message });
  }
};

export const getChapterById = (bookId, chapterId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTER_REQUEST });
  console.log("Action getChapterById dispatched");
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/books/${bookId}/chapters/${chapterId}`);
    console.log("Got chapter: ", data);
    dispatch({ type: GET_CHAPTER_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to retreiving chapter: ", error);
    dispatch({ type: GET_CHAPTER_FAILED, payload: error.message });
  }
};

export const addChapterAction = (bookId, chapterData) => async (dispatch) => {
  dispatch({ type: CHAPTER_UPLOAD_REQUEST });
  console.log("Action addChapterAction dispatched");
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/books/${bookId}/chapters`, chapterData.data);
    console.log("New chapter added", data);
    dispatch({ type: CHAPTER_UPLOAD_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to add new chapter: ", error);
    dispatch({ type: CHAPTER_UPLOAD_FAILED, payload: error.message });
  }
};
export const editChapterAction = (bookId, chapterId, chapterData) => async (dispatch) => {
  dispatch({ type: EDIT_CHAPTER_REQUEST });
  console.log("Action editChapterAction dispatched");
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/books/${bookId}/chapters/${chapterId}`, chapterData.data);
    console.log("Chapter edited", data);
    dispatch({ type: EDIT_CHAPTER_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to add new chapter: ", error);
    dispatch({ type: EDIT_CHAPTER_FAILED, payload: error.message });
  }
};
export const deleteChapterAction = (bookId, chapterId) => async (dispatch) => {
  dispatch({ type: DELETE_CHAPTER_REQUEST });
  console.log("Action deleteChapterAction dispatched");
  try {
    const { data } = await api.delete(`${API_BASE_URL}/api/books/${bookId}/chapters/${chapterId}`);
    console.log("Chapter deleted", data);
    dispatch({ type: DELETE_CHAPTER_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to delete chapter: ", error);
    dispatch({ type: DELETE_CHAPTER_FAILED, payload: error.message });
  }
};
export const saveChapterProgressAction = (bookId, chapterId, userId, progress) => async (dispatch) => {
  dispatch({ type: SAVE_PROGRESS_REQUEST });
  console.log("Action saveChapterProgressAction dispatched");
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/books/${bookId}/chapters/${chapterId}/progress`, { userId, progress });
    console.log("Progress saved", data);
    dispatch({ type: SAVE_PROGRESS_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to save progress: ", error);
    dispatch({ type: SAVE_PROGRESS_FAILED, payload: error.message });
  }
};
export const getReadingProgressByUserAndChapter = (userId, chapterId) => async (dispatch) => {
  dispatch({ type: GET_PROGRESS_REQUEST });
  console.log("Action getReadingProgressByUserAndChapter dispatched");
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/reading-progress/${userId}/${chapterId}`);
    console.log("Got progress for ", chapterId, ": ", data);
    dispatch({ type: GET_PROGRESS_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_PROGRESS_FAILED, payload: error.message });
  }
};
export const getReadingProgressByUser = (userId) => async (dispatch) => {
  dispatch({ type: GET_PROGRESS_REQUEST });
  console.log("Action getReadingProgressByUserAndChapter dispatched");
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/reading-progress/${userId}`);
    console.log("Got progress for ", userId, ": ", data);
    dispatch({ type: GET_PROGRESS_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_PROGRESS_FAILED, payload: error.message });
  }
};