import {
  CLIENT_LOGIN_FAILED,
  CLIENT_LOGIN_REQUEST,
  CLIENT_LOGIN_SUCCESS,
  CLIENT_LOGOUT,
  CLIENT_PASSWORD_UPDATE_FAILED,
  CLIENT_PASSWORD_UPDATE_REQUEST,
  CLIENT_PASSWORD_UPDATE_RESET,
  CLIENT_PASSWORD_UPDATE_SUCCESS,
  CLIENT_UPDATE_BYC_FAILED,
  CLIENT_UPDATE_BYC_REQUEST,
  CLIENT_UPDATE_BYC_RESET,
  CLIENT_UPDATE_BYC_SUCCESS,
  CLIENT_WITHDRAW_FAILED,
  CLIENT_WITHDRAW_REQUEST,
  CLIENT_WITHDRAW_SUCCESS,
  FETCH_REWARD_BY_CLIENT_FAILED,
  FETCH_REWARD_BY_CLIENT_REQUEST,
  FETCH_REWARD_BY_CLIENT_RESET,
  FETCH_REWARD_BY_CLIENT_SUCCESS,
  GET_CLIENT_PROFILE_BYC_REQUEST,
  GET_CLIENT_PROFILE_BYC_SUCCESS,
  GET_SINGLE_CLIENT_FAILED,
  CLIENT_WITHDRAW_RESET,
  GET_WITHDRAW_HISTORY_BYC_REQUEST,
  GET_WITHDRAW_HISTORY_BYC_SUCCESS,
  GET_WITHDRAW_HISTORY_BYC_FAILED,
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
export const GetClientProfileByCReducer = (
  state = { clientData: { client_hotspot: [] } },
  action
) => {
  switch (action.type) {
    case GET_CLIENT_PROFILE_BYC_REQUEST:
      return { loading: true };
    case GET_CLIENT_PROFILE_BYC_SUCCESS:
      return {
        loading: false,
        clientData: action.payload,
      };
    case FETCH_REWARD_BY_CLIENT_SUCCESS:
      return { clientData: action.payload };
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
export const resetPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case CLIENT_PASSWORD_UPDATE_REQUEST:
      return { loading: true };
    case CLIENT_PASSWORD_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case CLIENT_PASSWORD_UPDATE_FAILED:
      return { loading: false, error: action.payload };
    case CLIENT_PASSWORD_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
export const FetchRewardByClientReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_REWARD_BY_CLIENT_REQUEST:
      return { loading: true };
    case FETCH_REWARD_BY_CLIENT_SUCCESS:
      return { loading: false };
    case FETCH_REWARD_BY_CLIENT_FAILED:
      return { loading: false, error: action.payload };
    case FETCH_REWARD_BY_CLIENT_RESET:
      return {};
    default:
      return state;
  }
};
export const WithdrawRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case CLIENT_WITHDRAW_REQUEST:
      return { loading: true };
    case CLIENT_WITHDRAW_SUCCESS:
      return { loading: false, success: true };
    case CLIENT_WITHDRAW_FAILED:
      return { loading: false, error: action.payload };
    case CLIENT_WITHDRAW_RESET:
      return {};
    default:
      return state;
  }
};
export const WithdrawHistoryReducer = (state = { wHistories: [] }, action) => {
  switch (action.type) {
    case GET_WITHDRAW_HISTORY_BYC_REQUEST:
      return { loading: true };
    case GET_WITHDRAW_HISTORY_BYC_SUCCESS:
      return { loading: false, wHistories: action.payload };
    case GET_WITHDRAW_HISTORY_BYC_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
