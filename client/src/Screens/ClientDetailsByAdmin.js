import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { Switch, Route, useRouteMatch, useParams } from 'react-router';
import ClientProfileEditScreen from './ClientProfileEditScreen';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import AlertMessage from '../components/Alert';
import HotspotEditScreen from './HotspotEditScreen';
import { getSingleClient } from '../redux/action/AdminAction';
import ClientProfileScreenByAdmin from './ClientProfileScreenByAdmin';
import { Helmet } from 'react-helmet';

const ClientDetailsByAdmin = () => {
  const { path } = useRouteMatch();
  const { clientId } = useParams();

  const dispatch = useDispatch();

  const singleClientsGet = useSelector((state) => state.singleClientsGet);
  const { loading, clientData, error } = singleClientsGet;

  const loginClient = useSelector((state) => state.loginClient);
  const { cInfo } = loginClient;

  useEffect(() => {
    dispatch(getSingleClient(clientId));
  }, [dispatch, clientId, cInfo]);

  return (
    <Box p='4'>
      <Helmet>
        <title>Client Details | Admin Dashboard</title>
      </Helmet>
      {loading ? (
        <Loader />
      ) : error ? (
        <AlertMessage status='error' error={error} />
      ) : (
        <Switch>
          <Route
            exact
            path={path}
            component={() => (
              <ClientProfileScreenByAdmin client_details={clientData} />
            )}
          />
          <Route
            path={`${path}/edit`}
            component={() => (
              <ClientProfileEditScreen client_details={clientData} />
            )}
          />
          <Route
            path={`${path}/hotspot/:hotspotId/edit`}
            component={() => (
              <HotspotEditScreen hotspots={clientData?.client_hotspot} />
            )}
          />
        </Switch>
      )}
    </Box>
  );
};

export default ClientDetailsByAdmin;
