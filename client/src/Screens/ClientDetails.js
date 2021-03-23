import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

import { Switch, Route, useRouteMatch, useParams } from 'react-router';
import ClientProfileScreen from './ClientProfileScreen';
import { useDispatch, useSelector } from 'react-redux';
import { getClientProfileByClient } from '../redux/action/ClientAction';
import Loader from '../components/Loader';
import AlertMessage from '../components/Alert';
import ClientProfileEditByClient from './ClientProfileEditByClient';
import WithDrawScreen from './WithDrawScreen';
import { Helmet } from 'react-helmet';

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
      <Helmet>
        <title>My Account</title>
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
              <ClientProfileScreen client_details={clientData} />
            )}
          />
          <Route
            path={`${path}/edit`}
            component={() => (
              <ClientProfileEditByClient client_details={clientData} />
            )}
          />
          <Route
            path={`${path}/withdraw`}
            component={() => (
              <WithDrawScreen
                client={clientData?.client}
                wallet={clientData?.clientWallet}
              />
            )}
          />
        </Switch>
      )}
    </Box>
  );
};

export default ClientDetails;
