import React from 'react';
import { Box, Container } from '@chakra-ui/layout';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import ClientDetails from './ClientDetails';
import { useColorMode } from '@chakra-ui/color-mode';
import ClientNavbar from '../../components/ClientNavbar';
import ClientResetPasswordScreen from './ClientResetPasswordScreen';
import { Helmet } from 'react-helmet';

const ClientDashboard = () => {
  const { path } = useRouteMatch();
  const { colorMode } = useColorMode();

  return (
    <>
      <Helmet>
        <title>Client Dashboard</title>
      </Helmet>
      <ClientNavbar />
      <Container
        maxW='container.xl'
        backgroundColor={`${colorMode === 'light' ? '#fff' : '#0E0C1C'}`}
      >
        <Box
          w='100%'
          h='-moz-max-content'
          p='4'
          mt='3'
          borderRadius='md'
          bg={`${colorMode === 'dark' ? '#0E0C1C' : '#ffffff'}`}
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
