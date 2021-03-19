import axios from 'axios';
import { baseURL } from '../../baseURL';

import {
  ADMIN_LOGIN_FAILED,
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT,
  GET_ALL_CLIENTS_FAILED,
  GET_ALL_CLIENTS_REQUEST,
  GET_ALL_CLIENTS_SUCCESS,
  GET_SINGLE_CLIENT_FAILED,
  GET_SINGLE_CLIENT_REQUEST,
  GET_SINGLE_CLIENT_SUCCESS,
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

export const getAllClients = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_ALL_CLIENTS_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/api/admin/getAllClients`,
      config
    );
    dispatch({
      type: GET_ALL_CLIENTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_CLIENTS_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getSingleClient = (clientId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_SINGLE_CLIENT_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/api/admin/getSingleClientHotspots/${clientId}`,
      config
    );
    dispatch({
      type: GET_SINGLE_CLIENT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SINGLE_CLIENT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
