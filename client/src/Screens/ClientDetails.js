import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

import { Switch, Route, useRouteMatch, useParams } from 'react-router';
import ClientProfileScreen from './ClientProfileScreen';
import { useDispatch, useSelector } from 'react-redux';
import { getClientProfileByClient } from '../redux/action/ClientAction';
import Loader from '../components/Loader';
import AlertMessage from '../components/Alert';
import ClientProfileEditByClient from './ClientProfileEditByClient';

const ClientDetails = () => {
  const { path } = useRouteMatch();
  const { clientId } = useParams();

  const dispatch = useDispatch();

  const getClientByC = useSelector((state) => state.getClientByC);
  const { loading, clientData, error } = getClientByC;

  const loginClient = useSelector((state) => state.loginClient);
  const { cInfo } = loginClient;

  useEffect(() => {
    dispatch(getClientProfileByClient(cInfo?._id));
  }, [dispatch, clientId, cInfo]);

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
            component={() => (
              <ClientProfileScreen
                disableDeleteBtn
                client_details={clientData}
              />
            )}
          />
          <Route
            path={`${path}/edit`}
            component={() => (
              <ClientProfileEditByClient client_details={clientData} />
            )}
          />
        </Switch>
      )}
    </Box>
  );
};

export default ClientDetails;
