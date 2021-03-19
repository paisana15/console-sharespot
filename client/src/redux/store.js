import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {
  AdminLoginReducer,
  GetAllClientsReducer,
} from './reducer/AdminReducer';
import jwt from 'jsonwebtoken';

const reducer = combineReducers({
  loginAdmin: AdminLoginReducer,
  allClientsGet: GetAllClientsReducer,
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
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
