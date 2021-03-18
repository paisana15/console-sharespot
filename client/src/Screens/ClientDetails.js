import React from 'react';
import { Box } from '@chakra-ui/react';

import { Switch, Route, useRouteMatch } from 'react-router';
import ClientProfileScreen from './ClientProfileScreen';
import ClientProfileEditScreen from './ClientProfileEditScreen';

const ClientDetails = () => {
  const { path } = useRouteMatch();
  return (
    <Box p='4'>
      <Switch>
        <Route exact path={path} component={ClientProfileScreen} />
        <Route path={`${path}/edit`} component={ClientProfileEditScreen} />
      </Switch>
    </Box>
  );
};

export default ClientDetails;
