app.js

import React from 'react';
import './App.scss';
import { Redirect, Route, Switch } from 'react-router';
import AdminLogin from './Screens/admin/AdminLogin';
import AdminDashboard from './Screens/admin/AdminDashboard';
import { useSelector } from 'react-redux';
import ClientDashboard from './Screens/client/ClientDashboard';
import ClientLogin from './Screens/client/ClientLogin';
import RecoverPassword from './Screens/client/RecoverPassword';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const loginAdmin = useSelector((state) => state.loginAdmin);
  const { isAuthenticated } = loginAdmin;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/admin',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
const PrivateRoute2 = ({ component: Component, ...rest }) => {
  const loginClient = useSelector((state) => state.loginClient);
  const { isAuthenticated } = loginClient;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

function App() {
  console.log(
    '       ,--.                                                  ,--.  \n' +
      " ,---. |  ,---.  ,--,--.,--.--. ,---.  ,---.  ,---.  ,---. ,-'  '-. \n" +
      "(  .-' |  .-.  |' ,-.  ||  .--'| .-. :(  .-' | .-. || .-. |'-.  .-' \n" +
      ".-'  `)|  | |  |' '-'  ||  |   |   --..-'  `)| '-' '' '-' |  |  | \n" +
      "`----' `--' `--' `--`--'`--'    `----'`----' |  |-'  `---'   `--'  \n" +
      "                                             `--'   " +
      '\n- Welcome to the white label solution of Sharespot Dashboard! \n- We are always very grateful and open to receive your feedback be it tips, ideas, suggestions or any other comments with us at geral@sharespot.pt \n- If you have an interest in IoT and distributed technologies and might be interested in becoming part of the team feel free to reach out at any time.'
  );

  return (
    <>
      <Switch>
        <Route path='/admin' component={AdminLogin} />
        <PrivateRoute path='/h' component={AdminDashboard} />
        <Route path='/login' component={ClientLogin} />
        <Route path='/recover-password' component={RecoverPassword} />
        <PrivateRoute2 path='/c' component={ClientDashboard} />
        <Redirect to='/login' />
      </Switch>
    </>
  );
}

export default App;

