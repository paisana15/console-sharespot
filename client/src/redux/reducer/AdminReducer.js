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
  GET_WITHDRAWAL_REQUEST,
  GET_WITHDRAWAL_SUCCESS,
  GET_WITHDRAWAL_FAILED,
  HOTSPOT_DELETE,
  HOTSPOT_UPDATE_FAILED,
  HOTSPOT_UPDATE_REQUEST,
  HOTSPOT_UPDATE_RESET,
  HOTSPOT_UPDATE_SUCCESS,
  REJECT_WITHDRAW_REQUEST,
  REJECT_WITHDRAW_SUCCESS,
  REJECT_WITHDRAW_RESET,
  REJECT_WITHDRAW_FAILED,
  ACCEPT_WITHDRAW_REQUEST,
  ACCEPT_WITHDRAW_SUCCESS,
  ACCEPT_WITHDRAW_FAILED,
  ACCEPT_WITHDRAW_RESET,
  GET_MW_SW_CW_BALANCE_REQUEST,
  GET_MW_SW_CW_BALANCE_SUCCESS,
  GET_MW_SW_CW_BALANCE_RESET,
  GET_MANUAL_WITHDRAW_HISTORY_REQUEST,
  GET_MANUAL_WITHDRAW_HISTORY_SUCCESS,
  GET_MANUAL_WITHDRAW_HISTORY_FAILED,
  DELETE_MANUAL_WITHDRAW_HISTORY_REQUEST,
  DELETE_MANUAL_WITHDRAW_HISTORY_SUCCESS,
  DELETE_MANUAL_WITHDRAW_HISTORY_FAILED,
  ADD_MANUAL_WITHDRAW_HISTORY_REQUEST,
  ADD_MANUAL_WITHDRAW_HISTORY_SUCCESS,
  ADD_MANUAL_WITHDRAW_HISTORY_FAILED,
  GET_WITHDRAW_HISTORY_BYA_REQUEST,
  GET_WITHDRAW_HISTORY_BYA_SUCCESS,
  GET_WITHDRAW_HISTORY_BYA_FAILED,
  GET_REWARD_BY_ADMIN_REQUEST,
  GET_REWARD_BY_ADMIN_SUCCESS,
  GET_REWARD_BY_ADMIN_FAILED,
  GET_REWARD_BY_ADMIN_RESET,
  GET_AGREEMENTS_REQUEST,
  GET_AGREEMENTS_SUCCESS,
  GET_AGREEMENTS_FAILED,
  MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_REQUEST,
  MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_SUCCESS,
  MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_FAILED,
  MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_RESET,
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
  state = { clientData: { client: {}, client_hotspot: [], clientWallet: {} } },
  action
) => {
  switch (action.type) {
    case GET_SINGLE_CLIENT_REQUEST:
      return { loading: true };
    case GET_SINGLE_CLIENT_SUCCESS:
      return { loading: false, clientData: action.payload };
    case HOTSPOT_DELETE:
      return { loading: false, clientData: action.payload };
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
export const HotspotUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case HOTSPOT_UPDATE_REQUEST:
      return { loading: true };
    case HOTSPOT_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case HOTSPOT_UPDATE_FAILED:
      return { loading: false, error: action.payload };
    case HOTSPOT_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const GetWithdrawalRequestReducer = (
  state = { wRequests: [] },
  action
) => {
  switch (action.type) {
    case GET_WITHDRAWAL_REQUEST:
      return { loading: true };
    case GET_WITHDRAWAL_SUCCESS:
      return { loading: false, wRequests: action.payload };
    case REJECT_WITHDRAW_SUCCESS:
      return { loading: false, wRequests: action.payload };
    case GET_WITHDRAWAL_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const AcceptWithdrawReducer = (state = { wRequests: [] }, action) => {
  switch (action.type) {
    case ACCEPT_WITHDRAW_REQUEST:
      return { loading: true };
    case ACCEPT_WITHDRAW_SUCCESS:
      return { loading: false, success: true };
    case ACCEPT_WITHDRAW_FAILED:
      return { loading: false, error: action.payload };
    case ACCEPT_WITHDRAW_RESET:
      return { loading: false, success: false, error: null };
    default:
      return state;
  }
};
export const RejectWithdrawReducer = (state = { wRequests: [] }, action) => {
  switch (action.type) {
    case REJECT_WITHDRAW_REQUEST:
      return { loading: true };
    case REJECT_WITHDRAW_SUCCESS:
      return { loading: false, success: true };
    case REJECT_WITHDRAW_FAILED:
      return { loading: false, error: action.payload };
    case REJECT_WITHDRAW_RESET:
      return { loading: false, success: false, error: null };
    default:
      return state;
  }
};
export const GetMWSWCWReducer = (state = { balances: {} }, action) => {
  switch (action.type) {
    case GET_MW_SW_CW_BALANCE_REQUEST:
      return { loading: true };
    case GET_MW_SW_CW_BALANCE_SUCCESS:
      return { loading: false, balances: action.payload };
    case GET_MW_SW_CW_BALANCE_RESET:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const GetMWHistoriesReducer = (state = { mw_histories: [] }, action) => {
  switch (action.type) {
    case GET_MANUAL_WITHDRAW_HISTORY_REQUEST:
      return { loading: true };
    case GET_MANUAL_WITHDRAW_HISTORY_SUCCESS:
      return { loading: false, mw_histories: action.payload };
    case DELETE_MANUAL_WITHDRAW_HISTORY_SUCCESS:
      return { loading: false, mw_histories: action.payload };
    case ADD_MANUAL_WITHDRAW_HISTORY_SUCCESS:
      return { mw_histories: action.payload };
    case GET_MANUAL_WITHDRAW_HISTORY_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const AddMWHistoriesReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_MANUAL_WITHDRAW_HISTORY_REQUEST:
      return { loading: true };
    case ADD_MANUAL_WITHDRAW_HISTORY_SUCCESS:
      return { loading: false, success: true };
    case ADD_MANUAL_WITHDRAW_HISTORY_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const DeleteMWHistoriesReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_MANUAL_WITHDRAW_HISTORY_REQUEST:
      return { loading: true };
    case DELETE_MANUAL_WITHDRAW_HISTORY_SUCCESS:
      return { loading: false, success: true };
    case DELETE_MANUAL_WITHDRAW_HISTORY_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const WithdrawHistoryByAReducer = (
  state = { wHistories: [] },
  action
) => {
  switch (action.type) {
    case GET_WITHDRAW_HISTORY_BYA_REQUEST:
      return { loading: true };
    case GET_WITHDRAW_HISTORY_BYA_SUCCESS:
      return { loading: false, wHistories: action.payload };
    case GET_WITHDRAW_HISTORY_BYA_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const GetRewardByAdminReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_REWARD_BY_ADMIN_REQUEST:
      return { loading: true };
    case GET_REWARD_BY_ADMIN_SUCCESS:
      return { loading: false, success: true };
    case GET_REWARD_BY_ADMIN_FAILED:
      return { loading: false, error: action.payload };
    case GET_REWARD_BY_ADMIN_RESET:
      return {};
    default:
      return state;
  }
};

export const GetAgreementsReducer = (state = { agreements: [] }, action) => {
  switch (action.type) {
    case GET_AGREEMENTS_REQUEST:
      return { loading: true };
    case GET_AGREEMENTS_SUCCESS:
      return { loading: false, agreements: action.payload };
    case GET_AGREEMENTS_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const MultipleWithdrawRequestsAcceptReducer = (state = {}, action) => {
  switch (action.type) {
    case MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_REQUEST:
      return { loading: true };
    case MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_SUCCESS:
      return { loading: false, success: true };
    case MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_FAILED:
      return { loading: false, error: action.payload };
    case MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_RESET:
      return {};
    default:
      return state;
  }
};
