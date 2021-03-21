import axios from 'axios';
import { baseURL } from '../../baseURL';

import {
  CLIENT_LOGIN_REQUEST,
  CLIENT_LOGIN_SUCCESS,
  CLIENT_LOGIN_FAILED,
  CLIENT_LOGOUT,
} from '../actionTypes';

export const clientLogin = (credentials) => async (dispatch) => {
  try {
    dispatch({
      type: CLIENT_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      `${baseURL}/api/client/login`,
      credentials,
      config
    );
    localStorage.setItem('cInfo', JSON.stringify(data));
    dispatch({
      type: CLIENT_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLIENT_LOGIN_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const clientLogout = () => async (dispatch) => {
  try {
    localStorage.removeItem('cInfo');
    dispatch({ type: CLIENT_LOGOUT });
  } catch (err) {
    console.log(err);
  }
};
