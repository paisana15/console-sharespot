import axios from 'axios';
import { baseURL } from '../../baseURL';

import {
  CLIENT_LOGIN_REQUEST,
  CLIENT_LOGIN_SUCCESS,
  CLIENT_LOGIN_FAILED,
  CLIENT_LOGOUT,
  GET_CLIENT_PROFILE_BYC_REQUEST,
  GET_CLIENT_PROFILE_BYC_SUCCESS,
  GET_CLIENT_PROFILE_BYC_FAILED,
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

export const getClientProfileByClient = (clientId) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: GET_CLIENT_PROFILE_BYC_REQUEST,
    });
    const {
      loginClient: { cInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${cInfo._ctoken}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/api/client/getClientProfileByClient/${clientId}`,
      config
    );
    dispatch({
      type: GET_CLIENT_PROFILE_BYC_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_CLIENT_PROFILE_BYC_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
