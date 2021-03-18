import { Box, Container, Spacer, Stack } from '@chakra-ui/layout';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import Logo from './Logo';

const AdminNavbar = () => {
  const { path } = useRouteMatch();

  return (
    <Box color='white' overflow='hidden' bg='#2f2f2f' w='100%' p='4'>
      <Container maxW='container.xl'>
        <Stack align='center' direction={['column', 'row']} spacing='30px'>
          <Logo />
          <Spacer />
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing=''
            fontSize='sm'
            cursor='pointer'
          >
            <Link to={path}>
              <i className='fas fa-users'></i>
              <span className='admin_navlink'>Clients</span>
            </Link>
          </Box>
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            ml='6'
            fontSize='sm'
            cursor='pointer'
          >
            <Link to={`${path}/add-hotspot`}>
              <i className='fas fa-wifi'></i>
              <span className='admin_navlink'>Add Hotspot</span>
            </Link>
          </Box>
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            ml='6'
            fontSize='sm'
            cursor='pointer'
          >
            <Link to={`${path}/add-hotspot`}>
              <i className='fas fa-bell'></i>
              <span className='admin_navlink'>Notification</span>
            </Link>
          </Box>

          {/* <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            cursor='pointer'
            fontSize='sm'
          >
            <i className='fas fa-sign-in-alt'></i> Sign in
          </Box> */}

          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            cursor='pointer'
            fontSize='sm'
          >
            <i className='fas fa-sign-out-alt'></i>
            <span className='admin_navlink'>Sign out</span>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default AdminNavbar;
