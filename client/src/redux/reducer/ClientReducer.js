import {
  CLIENT_LOGIN_FAILED,
  CLIENT_LOGIN_REQUEST,
  CLIENT_LOGIN_SUCCESS,
  CLIENT_LOGOUT,
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
