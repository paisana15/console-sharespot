import axios from 'axios';
import { baseURL } from '../../constants';

import {
  CLIENT_LOGIN_REQUEST,
  CLIENT_LOGIN_SUCCESS,
  CLIENT_LOGIN_FAILED,
  CLIENT_LOGOUT,
  GET_CLIENT_PROFILE_BYC_REQUEST,
  GET_CLIENT_PROFILE_BYC_SUCCESS,
  GET_CLIENT_PROFILE_BYC_FAILED,
  CLIENT_UPDATE_BYC_REQUEST,
  CLIENT_UPDATE_BYC_SUCCESS,
  CLIENT_UPDATE_BYC_RESET,
  CLIENT_UPDATE_BYC_FAILED,
  CLIENT_PASSWORD_UPDATE_REQUEST,
  CLIENT_PASSWORD_UPDATE_SUCCESS,
  CLIENT_PASSWORD_UPDATE_RESET,
  CLIENT_PASSWORD_UPDATE_FAILED,
  CLIENT_WITHDRAW_REQUEST,
  CLIENT_WITHDRAW_SUCCESS,
  CLIENT_WITHDRAW_RESET,
  CLIENT_WITHDRAW_FAILED,
  GET_WITHDRAW_HISTORY_BYC_REQUEST,
  GET_WITHDRAW_HISTORY_BYC_SUCCESS,
  GET_WITHDRAW_HISTORY_BYC_FAILED,
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

export const getClientProfileByClient =
  (clientId) => async (dispatch, getState) => {
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
export const updateClientByClient =
  (clientId, client) => async (dispatch, getState) => {
    try {
      dispatch({
        type: CLIENT_UPDATE_BYC_REQUEST,
      });

      const {
        loginClient: { cInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${cInfo._ctoken}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/api/client/editSingleClientByClient/${clientId}`,
        client,
        config
      );
      dispatch({
        type: CLIENT_UPDATE_BYC_SUCCESS,
        payload: data,
      });
      setTimeout(() => {
        dispatch({
          type: CLIENT_UPDATE_BYC_RESET,
        });
      }, 2000);
    } catch (error) {
      dispatch({
        type: CLIENT_UPDATE_BYC_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      dispatch({
        type: CLIENT_UPDATE_BYC_RESET,
      });
    }
  };
export const passwordReset =
  (clientId, credentials, fromAdmin) => async (dispatch, getState) => {
    try {
      dispatch({
        type: CLIENT_PASSWORD_UPDATE_REQUEST,
      });

      const {
        loginClient: { cInfo },
      } = getState();

      const {
        loginAdmin: { aInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${fromAdmin ? aInfo._atoken : cInfo._ctoken}`,
        },
      };
      const { data } = await axios.put(
        fromAdmin
          ? `${baseURL}/api/client/resetPassword/byAdmin/${clientId}`
          : `${baseURL}/api/client/resetPassword/${clientId}`,
        credentials,
        config
      );
      dispatch({
        type: CLIENT_PASSWORD_UPDATE_SUCCESS,
        payload: data,
      });
      setTimeout(() => {
        dispatch({
          type: CLIENT_PASSWORD_UPDATE_RESET,
        });
      }, 2000);
    } catch (error) {
      dispatch({
        type: CLIENT_PASSWORD_UPDATE_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      dispatch({
        type: CLIENT_PASSWORD_UPDATE_RESET,
      });
    }
  };

export const withdrawRequestByClient =
  (clientId, amount) => async (dispatch, getState) => {
    try {
      dispatch({
        type: CLIENT_WITHDRAW_REQUEST,
      });
      const {
        loginClient: { cInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${cInfo._ctoken}`,
        },
      };
      const { data } = await axios.post(
        `${baseURL}/api/client/withdrawRequest/${clientId}`,
        amount,
        config
      );
      dispatch({
        type: CLIENT_WITHDRAW_SUCCESS,
        payload: data,
      });
      setTimeout(() => {
        dispatch({
          type: CLIENT_WITHDRAW_RESET,
        });
      }, 1000);
    } catch (error) {
      dispatch({
        type: CLIENT_WITHDRAW_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      dispatch({
        type: CLIENT_WITHDRAW_RESET,
      });
    }
  };

export const getWithdrawHistoryByC =
  (clientId) => async (dispatch, getState) => {
    try {
      dispatch({
        type: GET_WITHDRAW_HISTORY_BYC_REQUEST,
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
        `${baseURL}/api/client/getWithdrawHistory/${clientId}`,
        config
      );
      dispatch({
        type: GET_WITHDRAW_HISTORY_BYC_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_WITHDRAW_HISTORY_BYC_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
