import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

import { Switch, Route, useRouteMatch, useParams } from 'react-router';
import ClientProfileScreen from './ClientProfileScreen';
import ClientProfileEditScreen from './ClientProfileEditScreen';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleClient } from '../redux/action/AdminAction';
import Loader from '../components/Loader';
import AlertMessage from '../components/Alert';

const ClientDetails = () => {
  const { path } = useRouteMatch();
  const { clientId } = useParams();

  const dispatch = useDispatch();

  const singleClientsGet = useSelector((state) => state.singleClientsGet);
  const { loading, client, error } = singleClientsGet;

  useEffect(() => {
    dispatch(getSingleClient(clientId));
  }, [dispatch, clientId]);

  return (
    <Box p='4'>
      {loading ? (
        <Loader />
      ) : error ? (
        <AlertMessage status='error' error={error} />
      ) : (
        <Switch>
          <Route
            exact
            path={path}
            component={() => <ClientProfileScreen client_details={client} />}
          />
          <Route
            path={`${path}/edit`}
            component={() => (
              <ClientProfileEditScreen client_details={client} />
            )}
          />
        </Switch>
      )}
    </Box>
  );
};

export default ClientDetails;
