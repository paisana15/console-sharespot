import {
  ADMIN_LOGIN_FAILED,
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT,
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
