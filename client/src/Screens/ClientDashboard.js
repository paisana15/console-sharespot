import React from 'react';
import { Box, Container } from '@chakra-ui/layout';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import ClientDetails from './ClientDetails';
import { useColorMode } from '@chakra-ui/color-mode';
import ClientNavbar from '../components/ClientNavbar';
import ClientResetPasswordScreen from './ClientResetPasswordScreen';

const ClientDashboard = () => {
  const { path } = useRouteMatch();
  const { colorMode } = useColorMode();

  return (
    <>
      <ClientNavbar />
      <Container maxW='container.xl'>
        <Box
          w='100%'
          h='-moz-max-content'
          p='4'
          mt='3'
          borderRadius='md'
          shadow='md'
          bg={`${colorMode === 'dark' ? '#2a2f38' : '#ffffff'}`}
        >
          <Switch>
            <Route path={`${path}/profile`} component={ClientDetails} />
            <Route
              path={`${path}/reset-password`}
              component={ClientResetPasswordScreen}
            />
            <Redirect to={`${path}/profile`} />
          </Switch>
        </Box>
      </Container>
    </>
  );
};

export default ClientDashboard;