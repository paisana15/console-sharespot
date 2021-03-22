import { Box, Container, Spacer, Stack } from '@chakra-ui/layout';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { clientLogout } from '../redux/action/ClientAction';
import { useDispatch } from 'react-redux';
import Logo from './Logo';
import { useColorMode } from '@chakra-ui/color-mode';

const ClientNavbar = () => {
  const dispatch = useDispatch();
  const { path } = useRouteMatch();

  const { colorMode, toggleColorMode } = useColorMode();

  const logoutHandler = () => {
    dispatch(clientLogout());
  };
  return (
    <Box color='white' overflow='hidden' bg='#2f2f2f' w='100%' p='4'>
      <Container maxW='container.xl'>
        <Stack align='center' direction={['column', 'row']} spacing='30px'>
          <Logo />
          <Spacer />
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            ml='6'
            fontSize='sm'
            cursor='pointer'
          >
            <Link to={`${path}/profile`}>
              <i className='fas fa-wifi'></i>
              <span className='admin_navlink'>My Account</span>
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
            <Link to={`/c/profile/withdraw`}>
              <i className='fas fa-money-check-alt'></i>
              <span className='admin_navlink'>Withdraw</span>
            </Link>
          </Box>

          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            cursor='pointer'
            fontSize='sm'
          >
            <i className='fas fa-sign-out-alt'></i>
            <span onClick={logoutHandler} className='admin_navlink'>
              Sign out
            </span>
          </Box>
          <Box
            d='flex'
            borderRadius='full'
            fontWeight='semibold'
            letterSpacing='wide'
            bg='#505050'
            cursor='pointer'
            fontSize='sm'
            w='30px'
            h='30px'
            alignItems='center'
            justifyContent='center'
            color={`${colorMode === 'light' ? 'yellow.300' : 'white'}`}
            onClick={toggleColorMode}
          >
            <i className='fas fa-cloud-moon'></i>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ClientNavbar;
