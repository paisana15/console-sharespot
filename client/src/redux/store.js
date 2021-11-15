import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import jwt_decode from 'jwt-decode';

import {
  AcceptWithdrawReducer,
  AddHotspotClientReducer,
  AddMWHistoriesReducer,
  AddNewClientReducer,
  AdminLoginReducer,
  AdminResetClientPasswordReducer,
  ClientUpdateReducer,
  DeleteMWHistoriesReducer,
  DelSingleClientReducer,
  GetAgreementsReducer,
  GetAllClientsReducer,
  GetMWHistoriesReducer,
  GetMWSWCWReducer,
  GetRewardByAdminReducer,
  GetSingleClientReducer,
  GetWithdrawalRequestReducer,
  HotspotUpdateReducer,
  MultipleWithdrawRequestsAcceptReducer,
  RejectWithdrawReducer,
  WithdrawHistoryByAReducer,
} from './reducer/AdminReducer';
import {
  ClientLoginReducer,
  ClientUpdateByCReducer,
  GetClientProfileByCReducer,
  resetPasswordReducer,
  WithdrawRequestReducer,
  WithdrawHistoryReducer,
} from './reducer/ClientReducer';

const reducer = combineReducers({
  loginAdmin: AdminLoginReducer,
  allClientsGet: GetAllClientsReducer,
  singleClientsGet: GetSingleClientReducer,
  newClientAdd: AddNewClientReducer,
  singleClientDel: DelSingleClientReducer,
  hotspotClientAdd: AddHotspotClientReducer,
  clientUpdate: ClientUpdateReducer,
  hotspotUpdate: HotspotUpdateReducer,
  loginClient: ClientLoginReducer,
  getClientByC: GetClientProfileByCReducer,
  updateClientByC: ClientUpdateByCReducer,
  resetPassword: resetPasswordReducer,
  requestWithdraw: WithdrawRequestReducer,
  withdrawRequestGet: GetWithdrawalRequestReducer,
  histtoryWByc: WithdrawHistoryReducer,
  histtoryWBya: WithdrawHistoryByAReducer,
  withdrawReject: RejectWithdrawReducer,
  withdrawAccept: AcceptWithdrawReducer,
  MWSWCWget: GetMWSWCWReducer,
  getMWHistories: GetMWHistoriesReducer,
  addMWHistory: AddMWHistoriesReducer,
  deleteMWHistory: DeleteMWHistoriesReducer,
  getRewardByA: GetRewardByAdminReducer,
  agreementGet: GetAgreementsReducer,
  multipleWithdrawRequestsAccept: MultipleWithdrawRequestsAcceptReducer,
  adminResetClientPassword: AdminResetClientPasswordReducer,
});

const verifyToken = (token, lsItem) => {
  const currentDate = new Date();
  const decodeToken = jwt_decode(token);
  if (currentDate.getTime() > decodeToken.exp * 1000) {
    localStorage.removeItem(lsItem);
    return false;
  } else return true;
};

const initialState = {
  loginAdmin: {
    isAuthenticated: localStorage.getItem('aInfo')
      ? verifyToken(JSON.parse(localStorage.getItem('aInfo'))._atoken, 'aInfo')
      : false,
    aInfo: localStorage.getItem('aInfo')
      ? JSON.parse(localStorage.getItem('aInfo'))
      : {},
  },
  loginClient: {
    isAuthenticated: localStorage.getItem('cInfo')
      ? verifyToken(JSON.parse(localStorage.getItem('cInfo'))._ctoken, 'cInfo')
      : false,
    cInfo: localStorage.getItem('cInfo')
      ? JSON.parse(localStorage.getItem('cInfo'))
      : {},
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
