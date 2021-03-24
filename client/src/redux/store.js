import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {
  AcceptWithdrawReducer,
  AddHotspotClientReducer,
  AddNewClientReducer,
  AdminLoginReducer,
  ClientUpdateReducer,
  DelSingleClientReducer,
  FetchRewardByAdminReducer,
  GetAllClientsReducer,
  GetSingleClientReducer,
  GetWithdrawalRequestReducer,
  HotspotUpdateReducer,
  RejectWithdrawReducer,
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
  withdrawReject: RejectWithdrawReducer,
  withdrawAccept: AcceptWithdrawReducer,
});

const initialState = {
  loginAdmin: {
    isAuthenticated: localStorage.getItem('aInfo')
      ? jwt.verify(
          JSON.parse(localStorage.getItem('aInfo'))._atoken,
          `9856gf#o0B*kjvgi8796vfcwe`, // will be hidden in prod mode
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
          `9856gf#o0B*kjvgi8796vfcwe`, // will be hidden in prod mode
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
