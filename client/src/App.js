import React from 'react';
import './App.css';
import { Container } from '@chakra-ui/layout';
import Header from './components/Header';
import { Route } from 'react-router';
import WelcomeScreen from './Screens/WelcomeScreen';
import AdminLogin from './Screens/AdminLogin';
import Dashboard from './Screens/AdminDashboard';

function App() {
  return (
    <div>
      <Header />
      <Container maxW='container.lg'>
        <Route exact path='/' component={WelcomeScreen} />
        <Route path='/admin' component={AdminLogin} />
        <Route path='/h' component={Dashboard} />
      </Container>
    </div>
  );
}

export default App;
