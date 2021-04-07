import React from 'react';
import './App.scss';
import { Redirect, Route } from 'react-router';
import WelcomeScreen from './Screens/WelcomeScreen';
import AdminLogin from './Screens/AdminLogin';
import AdminDashboard from './Screens/AdminDashboard';
import { useSelector } from 'react-redux';
import ClientDashboard from './Screens/ClientDashboard';
import ClientLogin from './Screens/ClientLogin';

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
  return (
    <>
      <Route exact path='/' component={WelcomeScreen} />
      <Route path='/admin' component={AdminLogin} />
      <PrivateRoute path='/h' component={AdminDashboard} />
      <Route path='/login' component={ClientLogin} />
      <PrivateRoute2 path='/c' component={ClientDashboard} />
    </>
  );
}

export default App;
