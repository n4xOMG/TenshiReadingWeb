import { api, API_BASE_URL } from "../../api/api";
import { GET_ALL_USERS_FAILED, GET_ALL_USERS_REQUEST, GET_ALL_USERS_SUCCESS } from "./user.actionType";

export const getAllUsers = (page, size, searchTerm) => async (dispatch) => {
  dispatch({ type: GET_ALL_USERS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/admin/users`, {
      params: { page, size, searchTerm },
    });

    console.log("users", data);
    dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: GET_ALL_USERS_FAILED, payload: error.message });
  }
};
