import {
  ADD_FAQ_FAILED,
  ADD_FAQ_SUCCESS,
  DELETE_FAQ_SUCCESS,
  EDIT_FAQ_FAILED,
  EDIT_FAQ_SUCCESS,
  GET_ALL_FAQ_BY_LANGUAGE_FAILED,
  GET_ALL_FAQ_BY_LANGUAGE_SUCCESS,
  GET_ALL_FAQ_FAILED,
  GET_ALL_FAQ_SUCCESS,
  GET_ALL_LANGUAGES_WITH_FAQ_SUCCESS,
  GET_FAQ_FAILED,
  GET_FAQ_SUCCESS,
} from "./faq.actionType";

const initialState = {
  error: null,
  faqs: [],
  faqsByLanguage: [],
  languagesWithFaq: [],
  faq: null,
};

export const faqReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_FAQ_SUCCESS:
      return { ...state, error: null, faqs: action.payload };
    case GET_ALL_FAQ_BY_LANGUAGE_SUCCESS:
      return { ...state, error: null, faqsByLanguage: action.payload };
    case GET_ALL_LANGUAGES_WITH_FAQ_SUCCESS:
      return { ...state, error: null, languagesWithFaq: action.payload };
    case GET_FAQ_SUCCESS:
    case ADD_FAQ_SUCCESS:
    case EDIT_FAQ_SUCCESS:
      return { ...state, error: null, faq: action.payload };
    case DELETE_FAQ_SUCCESS:
      return { ...state, error: null };

    case GET_ALL_FAQ_FAILED:
    case GET_ALL_FAQ_BY_LANGUAGE_FAILED:
    case GET_FAQ_FAILED:
    case ADD_FAQ_FAILED:
    case EDIT_FAQ_FAILED:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
