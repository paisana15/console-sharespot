import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {
  AddHotspotClientReducer,
  AddNewClientReducer,
  AdminLoginReducer,
  ClientUpdateReducer,
  DelSingleClientReducer,
  GetAllClientsReducer,
  GetSingleClientReducer,
  HotspotUpdateReducer,
} from './reducer/AdminReducer';
import jwt from 'jsonwebtoken';
import { ClientLoginReducer } from './reducer/ClientReducer';

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
