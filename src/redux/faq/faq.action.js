import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
import {
  ADD_FAQ_FAILED,
  ADD_FAQ_REQUEST,
  ADD_FAQ_SUCCESS,
  DELETE_FAQ_FAILED,
  DELETE_FAQ_REQUEST,
  DELETE_FAQ_SUCCESS,
  EDIT_FAQ_FAILED,
  EDIT_FAQ_REQUEST,
  EDIT_FAQ_SUCCESS,
  GET_ALL_FAQ_BY_LANGUAGE_FAILED,
  GET_ALL_FAQ_BY_LANGUAGE_REQUEST,
  GET_ALL_FAQ_BY_LANGUAGE_SUCCESS,
  GET_ALL_FAQ_FAILED,
  GET_ALL_FAQ_REQUEST,
  GET_ALL_FAQ_SUCCESS,
  GET_ALL_LANGUAGES_WITH_FAQ_FAILED,
  GET_ALL_LANGUAGES_WITH_FAQ_REQUEST,
  GET_ALL_LANGUAGES_WITH_FAQ_SUCCESS,
  GET_FAQ_FAILED,
  GET_FAQ_REQUEST,
  GET_FAQ_SUCCESS,
} from "./faq.actionType";

export const getAllFaq = () => async (dispatch) => {
  dispatch({ type: GET_ALL_FAQ_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/faq`);
    dispatch({ type: GET_ALL_FAQ_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_ALL_FAQ_FAILED, payload: error.message });
  }
};
export const getAllFaqByLanguage = (langId) => async (dispatch) => {
  dispatch({ type: GET_ALL_FAQ_BY_LANGUAGE_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/faq/languages/${langId}`);
    dispatch({ type: GET_ALL_FAQ_BY_LANGUAGE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_ALL_FAQ_BY_LANGUAGE_FAILED, payload: error.message });
  }
};
export const getAllLanguagesWithFaq = () => async (dispatch) => {
  dispatch({ type: GET_ALL_LANGUAGES_WITH_FAQ_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/languages/faq`);
    dispatch({ type: GET_ALL_LANGUAGES_WITH_FAQ_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_ALL_LANGUAGES_WITH_FAQ_FAILED, payload: error.message });
  }
};
export const getFaqById = (faqId) => async (dispatch) => {
  dispatch({ type: GET_FAQ_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/faq/${faqId}`);
    dispatch({ type: GET_FAQ_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_FAQ_FAILED, payload: error.message });
  }
};
export const addNewFaq = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_FAQ_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/admin/faq`, reqData.data);
    dispatch({ type: ADD_FAQ_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: ADD_FAQ_FAILED, payload: error.message });
  }
};
export const editFaq = (faqData) => async (dispatch) => {
  dispatch({ type: EDIT_FAQ_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/admin/faq/${faqData.data.id}`, faqData.data);
    dispatch({ type: EDIT_FAQ_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: EDIT_FAQ_FAILED, payload: error.message });
  }
};

export const deleteFaq = (faqId) => async (dispatch) => {
  dispatch({ type: DELETE_FAQ_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/admin/faq/${faqId}`);
    dispatch({ type: DELETE_FAQ_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: DELETE_FAQ_FAILED, payload: error.message });
  }
};
