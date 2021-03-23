import React from 'react';
import { Box, Container } from '@chakra-ui/layout';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import AllClients from './AllClients';
import AddClientScreen from './AddClientScreen';
import AddHotspotScreen from './AddHotspotScreen';
import AdminNavbar from '../components/AdminNavbar';
import { useColorMode } from '@chakra-ui/color-mode';
import ClientDetailsByAdmin from './ClientDetailsByAdmin';
import WithdrawRequestScreen from './WithdrawRequestScreen';
import { Helmet } from 'react-helmet';

const AdminDashboard = () => {
  const { path } = useRouteMatch();
  const { colorMode } = useColorMode();

  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <AdminNavbar />
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
            <Route path={`${path}/clients`} component={AllClients} />
            <Route
              path={`${path}/client/:clientId`}
              component={ClientDetailsByAdmin}
            />
            <Route path={`${path}/add-hotspot`} component={AddHotspotScreen} />
            <Route
              path={`${path}/add-new-client`}
              component={AddClientScreen}
            />
            <Route
              path={`${path}/withdrawal-requests`}
              component={WithdrawRequestScreen}
            />
            <Redirect to={`${path}/clients`} />
          </Switch>
        </Box>
      </Container>
    </>
  );
};

export default AdminDashboard;
