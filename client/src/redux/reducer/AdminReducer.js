import {
  ADD_NEW_CLIENT_FAILED,
  ADD_NEW_CLIENT_REQUEST,
  ADD_NEW_CLIENT_RESET,
  ADD_NEW_CLIENT_SUCCESS,
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
export const GetSingleClientReducer = (state = { client: {} }, action) => {
  switch (action.type) {
    case GET_SINGLE_CLIENT_REQUEST:
      return { loading: true };
    case GET_SINGLE_CLIENT_SUCCESS:
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
