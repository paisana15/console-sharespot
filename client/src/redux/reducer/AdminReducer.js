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
} from '../actionTypes';

export const AdminLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case ADMIN_LOGIN_REQUEST:
      return { loading: true, isAuthenticated: false };
    case ADMIN_LOGIN_SUCCESS:
      return { loading: false, aInfo: action.payload, isAuthenticated: true };
    case ADMIN_LOGIN_FAILED:
      return { loading: false, error: action.payload, isAuthenticated: false };
    case ADMIN_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const GetAllClientsReducer = (state = { clients: [] }, action) => {
  switch (action.type) {
    case GET_ALL_CLIENTS_REQUEST:
      return { loading: true };
    case GET_ALL_CLIENTS_SUCCESS:
      return { loading: false, clients: action.payload };
    case GET_ALL_CLIENTS_FAILED:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
export const GetSingleClientReducer = (
  state = { client: { client_hotspot: [] } },
  action
) => {
  switch (action.type) {
    case GET_SINGLE_CLIENT_REQUEST:
      return { loading: true };
    case GET_SINGLE_CLIENT_SUCCESS:
      return { loading: false, client: action.payload };
    case HOTSPOT_DELETE:
      return { loading: false, client: action.payload };
    case GET_SINGLE_CLIENT_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const AddNewClientReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_NEW_CLIENT_REQUEST:
      return { loading: true };
    case ADD_NEW_CLIENT_SUCCESS:
      return { loading: false, success: true };
    case ADD_NEW_CLIENT_FAILED:
      return { loading: false, error: action.payload };
    case ADD_NEW_CLIENT_RESET:
      return {};
    default:
      return state;
  }
};
export const DelSingleClientReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_SINGLE_CLIENT_REQUEST:
      return { loading: true };
    case DELETE_SINGLE_CLIENT_SUCCESS:
      return { loading: false, success: true };
    case DELETE_SINGLE_CLIENT_FAILED:
      return { loading: false, error: action.payload };
    case DELETE_SINGLE_CLIENT_RESET:
      return {};
    default:
      return state;
  }
};
export const AddHotspotClientReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_HOTSPOT_TO_CLIENT_REQUEST:
      return { loading: true };
    case ADD_HOTSPOT_TO_CLIENT_SUCCESS:
      return { loading: false, success: true };
    case ADD_HOTSPOT_TO_CLIENT_FAILED:
      return { loading: false, error: action.payload };
    case ADD_HOTSPOT_TO_CLIENT_RESET:
      return {};
    default:
      return state;
  }
};
export const ClientUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case CLIENT_UPDATE_REQUEST:
      return { loading: true };
    case CLIENT_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case CLIENT_UPDATE_FAILED:
      return { loading: false, error: action.payload };
    case CLIENT_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
