import { Box, Container, Flex } from '@chakra-ui/layout';
import React, { useState } from 'react';
import Logo from './Logo';

const NavbarLogin = () => {
  const [showMenu, setShow] = useState(false);

  return (
    <Box className='navbar-login' color='white' overflow='hidden' bg='#2a2f38' w='100%' p='4'>
      <Container maxW='container.xl'>
        <Flex as='nav' align='center' justify='space-between' wrap='wrap'>
          <Box display='flex' alignItems='center'>
            <Logo />
            <span className="border-white-left"/>
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
             <a href="mailto:support@sharespot.pt" target="_blank" rel="noopener noreferrer">
                <span>support@sharespot.pt</span>
              </a>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default NavbarLogin;
