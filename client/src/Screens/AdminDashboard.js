import React from 'react';
import { Box } from '@chakra-ui/layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/breadcrumb';
import { Route, Switch, useRouteMatch } from 'react-router';
import AllClients from './AllClients';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import ClientDetails from './ClientDetails';
import AddClientScreen from './AddClientScreen';
import AddHotspotScreen from './AddHotspotScreen';

const Dashboard = () => {
  const { path } = useRouteMatch();
  return (
    <Box
      w='100%'
      h='-moz-max-content'
      p='4'
      mt='5'
      borderRadius='md'
      shadow='md'
    >
      <Breadcrumb
        style={{ fontSize: 14 }}
        mb=''
        separator={<ChevronRightIcon color='gray.500' />}
        spacing='4'
        p='3'
      >
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link to={path}>
              <i className='fas fa-users'></i> Client
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link to={`${path}/add-hotspot`}>
              <i className='fas fa-wifi'></i> Add Hotspot
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <i className='fas fa-bell'></i> Notification
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <i className='fas fa-sign-out-alt'></i> Sign out
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Switch>
        <Route exact path={path} component={AllClients} />
        <Route path={`${path}/clients/:clientId`} component={ClientDetails} />
        <Route path={`${path}/add-hotspot`} component={AddHotspotScreen} />
        <Route path={`${path}/add-new-client`} component={AddClientScreen} />
      </Switch>
    </Box>
  );
};

export default Dashboard;
