import {
  ADD_IMAGE_FAILED,
  ADD_IMAGE_REQUEST,
  ADD_IMAGE_SUCCESS,
  ADD_IMAGE_TAG_FAILED,
  ADD_IMAGE_TAG_REQUEST,
  ADD_IMAGE_TAG_SUCCESS,
  ADD_TO_FAV_FAILED,
  ADD_TO_FAV_REQUEST,
  ADD_TO_FAV_SUCCESS,
  DELETE_IMAGE_FAILED,
  DELETE_IMAGE_REQUEST,
  DELETE_IMAGE_SUCCESS,
  DELETE_IMAGE_TAG_FAILED,
  DELETE_IMAGE_TAG_REQUEST,
  DELETE_IMAGE_TAG_SUCCESS,
  EDIT_IMAGE_FAILED,
  EDIT_IMAGE_REQUEST,
  EDIT_IMAGE_SUCCESS,
  EDIT_IMAGE_TAG_FAILED,
  EDIT_IMAGE_TAG_REQUEST,
  EDIT_IMAGE_TAG_SUCCESS,
  GET_ALL_IMAGE_TAGS_FAILED,
  GET_ALL_IMAGE_TAGS_REQUEST,
  GET_ALL_IMAGE_TAGS_SUCCESS,
  GET_ALL_IMAGES_FAILED,
  GET_ALL_IMAGES_REQUEST,
  GET_ALL_IMAGES_SUCCESS,
  GET_TAGS_BY_IMAGE_FAILED,
  GET_TAGS_BY_IMAGE_REQUEST,
  GET_TAGS_BY_IMAGE_SUCCESS,
} from "./gallery.actionType";

const initialState = {
  jwt: null,
  error: null,
  image: null,
  images: [],
  totalPages: null,
  tag: null,
  tags: [],
  loading: false,
};

export const galleryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_IMAGE_REQUEST:
    case ADD_IMAGE_TAG_REQUEST:
    case ADD_TO_FAV_REQUEST:
    case GET_ALL_IMAGES_REQUEST:
    case GET_ALL_IMAGE_TAGS_REQUEST:
    case EDIT_IMAGE_REQUEST:
    case EDIT_IMAGE_TAG_REQUEST:
    case DELETE_IMAGE_REQUEST:
    case DELETE_IMAGE_TAG_REQUEST:
    case GET_TAGS_BY_IMAGE_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_IMAGE_SUCCESS:
    case EDIT_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        image: action.payload,
        images: state.images.map((item) => (item.id === action.payload.id ? action.payload : item)),
      };
    case ADD_TO_FAV_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        images: state.images.map((item) => (item.id === action.payload.id ? action.payload : item)),
      };
    case ADD_IMAGE_TAG_SUCCESS:
    case EDIT_IMAGE_TAG_SUCCESS:
      return { ...state, loading: false, error: null, tag: action.payload };

    case GET_ALL_IMAGES_SUCCESS:
      return { ...state, loading: false, error: null, images: action.payload.images, totalPages: action.payload.totalPages };
    case GET_ALL_IMAGE_TAGS_SUCCESS:
    case GET_TAGS_BY_IMAGE_SUCCESS:
      return { ...state, loading: false, error: null, tags: action.payload };
    case DELETE_IMAGE_TAG_SUCCESS:
    case DELETE_IMAGE_SUCCESS:
      return { ...state, loading: false, error: null };
    case ADD_IMAGE_FAILED:
    case ADD_IMAGE_TAG_FAILED:
    case ADD_TO_FAV_FAILED:
    case GET_ALL_IMAGES_FAILED:
    case GET_ALL_IMAGE_TAGS_FAILED:
    case EDIT_IMAGE_FAILED:
    case EDIT_IMAGE_TAG_FAILED:
    case DELETE_IMAGE_FAILED:
    case DELETE_IMAGE_TAG_FAILED:
    case GET_TAGS_BY_IMAGE_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
