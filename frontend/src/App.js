import React from 'react';
import './App.css';
import { Container } from '@chakra-ui/layout';
import Header from './components/Header';
import { Route } from 'react-router';
import WelcomeScreen from './components/WelcomeScreen';
import AdminLogin from './components/AdminLogin';

function App() {
  return (
    <div>
      <Header />
      <Container maxW='container.lg'>
        <Route exact path='/' component={WelcomeScreen} />
        <Route path='/admin' component={AdminLogin} />
      </Container>
    </div>
  );
}

export default App;
