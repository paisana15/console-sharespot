import { Box, Container, Flex } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import Logo from './Logo';

const NavbarLogin = () => {
  const { path } = useRouteMatch();
  const [showMenu, setShow] = useState(false);

  return (
    <Box className='navbar-login' color='white' overflow='hidden' bg='#2a2f38' w='100%' p='4'>
      <Container maxW='container.xl'>
        <Flex as='nav' align='center' justify='space-between' wrap='wrap'>
          <Box display='flex' alignItems='center'>
            <Logo />
            <h3 className='font-weight-lighter'>
              wallet
              <span className='font-weight-bold'>dashboard</span>
            </h3>
          </Box>
          <Box
            onClick={() => setShow(!showMenu)}
            display={{ base: 'block', md: 'none' }}
          >
            <i className='fas fa-bars'></i>
          </Box>
          <Box
            display={{ base: showMenu ? 'block' : 'none', md: 'flex' }}
            alignItems='center'
          >
            <Link to={`${path}/profile`}>
              <span>
                support@sharespot.pt
              </span>
            </Link>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default NavbarLogin;
