import React from 'react';
import './App.css';
import { Redirect, Route } from 'react-router';
import WelcomeScreen from './Screens/WelcomeScreen';
import AdminLogin from './Screens/AdminLogin';
import AdminDashboard from './Screens/AdminDashboard';
import { useSelector } from 'react-redux';

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

function App() {
  return (
    <div>
      <Route exact path='/' component={WelcomeScreen} />
      <Route path='/admin' component={AdminLogin} />
      <PrivateRoute path='/h' component={AdminDashboard} />
    </div>
  );
}

export default App;
