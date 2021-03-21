import axios from 'axios';
import { baseURL } from '../../baseURL';

import {
  ADD_HOTSPOT_TO_CLIENT_FAILED,
  ADD_HOTSPOT_TO_CLIENT_REQUEST,
  ADD_HOTSPOT_TO_CLIENT_RESET,
  ADD_HOTSPOT_TO_CLIENT_SUCCESS,
  ADD_NEW_CLIENT_FAILED,
  ADD_NEW_CLIENT_REQUEST,
  ADD_NEW_CLIENT_RESET,
  ADD_NEW_CLIENT_SUCCESS,
  ADMIN_LOGIN_FAILED,
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT,
  CLIENT_UPDATE_FAILED,
  CLIENT_UPDATE_REQUEST,
  CLIENT_UPDATE_RESET,
  CLIENT_UPDATE_SUCCESS,
  DELETE_SINGLE_CLIENT_FAILED,
  DELETE_SINGLE_CLIENT_REQUEST,
  DELETE_SINGLE_CLIENT_RESET,
  DELETE_SINGLE_CLIENT_SUCCESS,
  GET_ALL_CLIENTS_FAILED,
  GET_ALL_CLIENTS_REQUEST,
  GET_ALL_CLIENTS_SUCCESS,
  GET_SINGLE_CLIENT_FAILED,
  GET_SINGLE_CLIENT_REQUEST,
  GET_SINGLE_CLIENT_SUCCESS,
  HOTSPOT_DELETE,
  HOTSPOT_UPDATE_FAILED,
  HOTSPOT_UPDATE_REQUEST,
  HOTSPOT_UPDATE_RESET,
  HOTSPOT_UPDATE_SUCCESS,
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

export const addNewClient = (client) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADD_NEW_CLIENT_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.post(
      `${baseURL}/api/admin/addNewClient`,
      client,
      config
    );
    dispatch({
      type: ADD_NEW_CLIENT_SUCCESS,
      payload: data,
    });
    dispatch({
      type: ADD_NEW_CLIENT_RESET,
    });
  } catch (error) {
    dispatch({
      type: ADD_NEW_CLIENT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const updateClient = (clientId, client) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: CLIENT_UPDATE_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/admin/editClientProfile/${clientId}`,
      client,
      config
    );
    dispatch({
      type: CLIENT_UPDATE_SUCCESS,
      payload: data,
    });
    setTimeout(() => {
      dispatch({
        type: CLIENT_UPDATE_RESET,
      });
    }, 2000);
  } catch (error) {
    dispatch({
      type: CLIENT_UPDATE_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteClient = (clientId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DELETE_SINGLE_CLIENT_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.delete(
      `${baseURL}/api/admin/deleteClient/${clientId}`,
      config
    );
    dispatch({
      type: DELETE_SINGLE_CLIENT_SUCCESS,
      payload: data,
    });
    setTimeout(() => {
      dispatch({
        type: DELETE_SINGLE_CLIENT_RESET,
      });
    }, 5000);
  } catch (error) {
    dispatch({
      type: DELETE_SINGLE_CLIENT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addHotspotToClient = (datas) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADD_HOTSPOT_TO_CLIENT_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.post(
      `${baseURL}/api/admin/addHotspot`,
      datas,
      config
    );
    dispatch({
      type: ADD_HOTSPOT_TO_CLIENT_SUCCESS,
      payload: data,
    });
    setTimeout(() => {
      dispatch({
        type: ADD_HOTSPOT_TO_CLIENT_RESET,
      });
    }, 3000);
  } catch (error) {
    dispatch({
      type: ADD_HOTSPOT_TO_CLIENT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteHotspot = (hotspotId, clientId) => async (
  dispatch,
  getState
) => {
  try {
    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.delete(
      `${baseURL}/api/admin/deleteHotspot/${hotspotId}/${clientId}`,
      config
    );
    dispatch({
      type: HOTSPOT_DELETE,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADD_HOTSPOT_TO_CLIENT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateHotspot = (hotspotId, hotspot) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: HOTSPOT_UPDATE_REQUEST,
    });
    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    await axios.put(
      `${baseURL}/api/admin/editHotspot/${hotspotId}`,
      hotspot,
      config
    );
    dispatch({
      type: HOTSPOT_UPDATE_SUCCESS,
    });
    setTimeout(() => {
      dispatch({
        type: HOTSPOT_UPDATE_RESET,
      });
    }, 2000);
  } catch (error) {
    dispatch({
      type: HOTSPOT_UPDATE_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
