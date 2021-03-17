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

const Dashboard = () => {
  const { url, path } = useRouteMatch();
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
        mb='5'
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
            <i className='fas fa-wifi'></i> Add Hotspot
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
        <Route path={`${url}/clients/:clientId`} component={ClientDetails} />
      </Switch>
    </Box>
  );
};

export default Dashboard;
