import {
  CLIENT_LOGIN_FAILED,
  CLIENT_LOGIN_REQUEST,
  CLIENT_LOGIN_SUCCESS,
  CLIENT_LOGOUT,
  CLIENT_UPDATE_BYC_FAILED,
  CLIENT_UPDATE_BYC_REQUEST,
  CLIENT_UPDATE_BYC_RESET,
  CLIENT_UPDATE_BYC_SUCCESS,
  GET_CLIENT_PROFILE_BYC_REQUEST,
  GET_CLIENT_PROFILE_BYC_SUCCESS,
  GET_SINGLE_CLIENT_FAILED,
} from '../actionTypes';

export const ClientLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case CLIENT_LOGIN_REQUEST:
      return { loading: true, isAuthenticated: false };
    case CLIENT_LOGIN_SUCCESS:
      return { loading: false, cInfo: action.payload, isAuthenticated: true };
    case CLIENT_LOGIN_FAILED:
      return { loading: false, error: action.payload, isAuthenticated: false };
    case CLIENT_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const GetClientProfileByCReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CLIENT_PROFILE_BYC_REQUEST:
      return { loading: true };
    case GET_CLIENT_PROFILE_BYC_SUCCESS:
      return {
        loading: false,
        clientData: action.payload,
      };
    case GET_SINGLE_CLIENT_FAILED:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const ClientUpdateByCReducer = (state = {}, action) => {
  switch (action.type) {
    case CLIENT_UPDATE_BYC_REQUEST:
      return { loading: true };
    case CLIENT_UPDATE_BYC_SUCCESS:
      return { loading: false, success: true };
    case CLIENT_UPDATE_BYC_FAILED:
      return { loading: false, error: action.payload };
    case CLIENT_UPDATE_BYC_RESET:
      return {};
    default:
      return state;
  }
};
