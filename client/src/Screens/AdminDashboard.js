import React from 'react';
import { Box, Container } from '@chakra-ui/layout';

import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import AllClients from './AllClients';

import ClientDetails from './ClientDetails';
import AddClientScreen from './AddClientScreen';
import AddHotspotScreen from './AddHotspotScreen';
import AdminNavbar from '../components/AdminNavbar';

const AdminDashboard = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <AdminNavbar />
      <Container maxW='container.xl'>
        <Box
          w='100%'
          h='-moz-max-content'
          p='4'
          mt='3'
          borderRadius='md'
          shadow='md'
        >
          <Switch>
            <Route path={`${path}/clients`} component={AllClients} />
            <Route
              path={`${path}/client/:clientId`}
              component={ClientDetails}
            />
            <Route path={`${path}/add-hotspot`} component={AddHotspotScreen} />
            <Route
              path={`${path}/add-new-client`}
              component={AddClientScreen}
            />
            <Redirect to={`${path}/clients`} />
          </Switch>
        </Box>
      </Container>
    </>
  );
};

export default AdminDashboard;
