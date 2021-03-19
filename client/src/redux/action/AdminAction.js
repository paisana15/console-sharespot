import axios from 'axios';
import { baseURL } from '../../baseURL';

import {
  ADMIN_LOGIN_FAILED,
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT,
} from '../actionTypes';

export const adminLogin = (credentials) => async (dispatch) => {
  try {
    dispatch({
      type: ADMIN_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      `${baseURL}/api/admin/login`,
      { credentials },
      config
    );
    localStorage.setItem('aInfo', JSON.stringify(data));
    dispatch({
      type: ADMIN_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_LOGIN_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const adminLogout = () => async (dispatch) => {
  try {
    localStorage.removeItem('aInfo');
    dispatch({ type: ADMIN_LOGOUT });
  } catch (err) {
    console.log(err);
  }
};
export const getAllArticles = () => async (dispatch, getState) => {
  try {
  } catch (error) {}
};
