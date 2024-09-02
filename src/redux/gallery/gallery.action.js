import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
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

export const getAllGalleryImages = (page, size) => async (dispatch) => {
  dispatch({ type: GET_ALL_IMAGES_REQUEST });
  console.log("getAllGalleryImages action dispatched");
  try {
    const { data } = await axios.get(`${API_BASE_URL}/gallery`, {
      params: { page, size },
    });
    dispatch({ type: GET_ALL_IMAGES_SUCCESS, payload: data });
    console.log("Images: ", { payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all images", error);
    dispatch({ type: GET_ALL_IMAGES_FAILED, payload: error });
  }
};

export const getUserFavImages = (userId) => async (dispatch) => {
  dispatch({ type: GET_ALL_IMAGES_REQUEST });
  console.log("getAllGalleryImages action dispatched");
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/gallery/favoured/${userId}`);
    dispatch({ type: GET_ALL_IMAGES_SUCCESS, payload: data });
    console.log("Images: ", { payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all images", error);
    dispatch({ type: GET_ALL_IMAGES_FAILED, payload: error });
  }
};

export const getAllImageTags = () => async (dispatch) => {
  dispatch({ type: GET_ALL_IMAGE_TAGS_REQUEST });
  console.log("getAllImageTags action dispatched");
  try {
    const { data } = await axios.get(`${API_BASE_URL}/gallery/tags`);
    dispatch({ type: GET_ALL_IMAGE_TAGS_SUCCESS, payload: data });
    console.log("Tags: ", { payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all tags", error);
    dispatch({ type: GET_ALL_IMAGE_TAGS_FAILED, payload: error });
  }
};

export const getTagsByImageId = (imageId) => async (dispatch) => {
  dispatch({ type: GET_TAGS_BY_IMAGE_REQUEST });
  console.log("getTagsByImageId action dispatched");
  try {
    const { data } = await axios.get(`${API_BASE_URL}/gallery/tags/${imageId}`);
    dispatch({ type: GET_TAGS_BY_IMAGE_SUCCESS, payload: data });
    console.log("Tags: ", { payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all tags from image", error);
    dispatch({ type: GET_TAGS_BY_IMAGE_FAILED, payload: error });
  }
};

export const addImageAction = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_IMAGE_REQUEST });
  console.log("addImageAction action dispatched with data: ", reqData.data);
  try {
    const { data } = await api.post(`${API_BASE_URL}/admin/gallery`, reqData.data);
    dispatch({ type: ADD_IMAGE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to add images", error);
    dispatch({ type: ADD_IMAGE_FAILED, payload: error });
  }
};

export const editImageAction = (imageData) => async (dispatch) => {
  dispatch({ type: EDIT_IMAGE_REQUEST });
  console.log("editImageAction action dispatched");
  console.log("Payload:", imageData);

  try {
    console.log("Image ID:", imageData.data.id);
    const { data } = await api.put(`${API_BASE_URL}/admin/gallery/${imageData.data.id}`, imageData.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: EDIT_IMAGE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Error trying to edit images:", error.response ? error.response.data : error.message);
    dispatch({ type: EDIT_IMAGE_FAILED, payload: error });
  }
};

export const deleteImageAction = (imageId) => async (dispatch) => {
  dispatch({ type: DELETE_IMAGE_REQUEST });
  console.log("deleteImageAction action dispatched");
  try {
    const { data } = await api.delete(`${API_BASE_URL}/admin/gallery/${imageId}`);
    dispatch({ type: DELETE_IMAGE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to delete images", error);
    dispatch({ type: DELETE_IMAGE_FAILED, payload: error });
  }
};

export const addTagAction = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_IMAGE_TAG_REQUEST });
  console.log("addTagAction action dispatched");
  try {
    const { data } = await api.post(`${API_BASE_URL}/admin/gallery/tags`, reqData.data);
    dispatch({ type: ADD_IMAGE_TAG_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to add tag", error);
    dispatch({ type: ADD_IMAGE_TAG_FAILED, payload: error });
  }
};

export const editTagAction = (tagData) => async (dispatch) => {
  dispatch({ type: EDIT_IMAGE_TAG_REQUEST });
  console.log("editTagAction action dispatched");
  console.log("Payload:", tagData);

  try {
    console.log("TAG ID:", tagData.data.id);
    const { data } = await api.put(`${API_BASE_URL}/admin/gallery/tags/${tagData.data.id}`, tagData.data);
    dispatch({ type: EDIT_IMAGE_TAG_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Error trying to edit tag:", error.response ? error.response.data : error.message);
    dispatch({ type: EDIT_IMAGE_TAG_FAILED, payload: error });
  }
};

export const deleteTagAction = (tagId) => async (dispatch) => {
  dispatch({ type: DELETE_IMAGE_TAG_REQUEST });
  console.log("deleteTagAction action dispatched");
  try {
    const { data } = await api.delete(`${API_BASE_URL}/admin/gallery/tags/${tagId}`);
    dispatch({ type: DELETE_IMAGE_TAG_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to delete tag", error);
    dispatch({ type: DELETE_IMAGE_TAG_FAILED, payload: error });
  }
};

export const addImageToFav = (imageId) => async (dispatch) => {
  dispatch({ type: ADD_TO_FAV_REQUEST });
  console.log("addImageToFav action dispatched with imageId: ", imageId);
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/gallery/favoured/${imageId}`);
    dispatch({ type: ADD_TO_FAV_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to add images", error);
    dispatch({ type: ADD_TO_FAV_FAILED, payload: error });
  }
};
