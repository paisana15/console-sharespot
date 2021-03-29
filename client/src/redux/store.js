import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {
  AcceptWithdrawReducer,
  AddHotspotClientReducer,
  AddMWHistoriesReducer,
  AddNewClientReducer,
  AdminLoginReducer,
  ClientUpdateReducer,
  DeleteMWHistoriesReducer,
  DelSingleClientReducer,
  FetchRewardByAdminReducer,
  GetAllClientsReducer,
  GetMWHistoriesReducer,
  GetMWSWCWReducer,
  GetSingleClientReducer,
  GetWithdrawalRequestReducer,
  HotspotUpdateReducer,
  RejectWithdrawReducer,
  WithdrawHistoryByAReducer,
} from './reducer/AdminReducer';
import jwt from 'jsonwebtoken';
import {
  ClientLoginReducer,
  ClientUpdateByCReducer,
  GetClientProfileByCReducer,
  resetPasswordReducer,
  FetchRewardByClientReducer,
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
  fetchReward: FetchRewardByAdminReducer,
  getReward: FetchRewardByClientReducer,
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
});

const initialState = {
  loginAdmin: {
    isAuthenticated: localStorage.getItem('aInfo')
      ? jwt.verify(
          JSON.parse(localStorage.getItem('aInfo'))._atoken,
          `${process.env.JWT_SECRET}`,
          (err, dec) => {
            if (err) {
              localStorage.removeItem('aInfo');
              return false;
            } else {
              return true;
            }
          }
        )
      : false,
    aInfo: localStorage.getItem('aInfo')
      ? JSON.parse(localStorage.getItem('aInfo'))
      : {},
  },
  loginClient: {
    isAuthenticated: localStorage.getItem('cInfo')
      ? jwt.verify(
          JSON.parse(localStorage.getItem('cInfo'))._ctoken,
          `${process.env.JWT_SECRET}`,
          (err, dec) => {
            if (err) {
              localStorage.removeItem('cInfo');
              return false;
            } else {
              return true;
            }
          }
        )
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
