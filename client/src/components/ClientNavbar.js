import { Box, Container, Flex, Text } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { clientLogout } from '../redux/action/ClientAction';
import { useDispatch } from 'react-redux';
import Logo from './Logo';
import { useColorMode } from '@chakra-ui/color-mode';
import { IconButton } from '@chakra-ui/button';
import DashboardSelected from '../assets/icons/dashboard-icon-selected.svg';
// import DashboardNotSelected from '../assets/icons/dashboard-icon-not-selected.svg'

const MenuItems = ({ children }) => (
  <Text
    className='d-flex'
    color='white'
    fontWeight='normal'
    letterSpacing=''
    fontSize='sm'
    cursor='pointer'
    mt={{ base: 4, md: 0 }}
    mr={6}
    display='block'
  >
    {children}
  </Text>
);

const ClientNavbar = () => {
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const [showMenu, setShow] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();

  const logoutHandler = () => {
    dispatch(clientLogout());
  };
  return (
    <Box className='navbar-dashboard' color='white' overflow='hidden' bg='#2a2f38' w='100%' p='4'>
      <Container maxW='container.xl'>
        <Flex as='nav' align='center' justify='space-between' wrap='wrap'>
          <Box display='flex' alignItems='center'>
            <Logo />
              <span className='border-white-left-dashboard'/>
              <h3 className='font-weight-lighter'>
                wallet
                <span className='font-weight-bold'>dashboard</span>
              </h3>
            {/* </div> */}
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
              <MenuItems>
                <img className='mr-2' src={DashboardSelected} alt='dashboard icon' height='25' width='25'/>
                Dashboard
              </MenuItems>
            </Link>
            <Link to={`/c/profile/edit`}>
              <MenuItems>
                <i className='fas fa-money-check-alt'></i> My account
              </MenuItems>
            </Link>
            <Link to={`/c/profile/withdraw`}>
              <MenuItems>
                <i className='fas fa-money-check-alt'></i> Withdraw
              </MenuItems>
            </Link>
          </Box>
          <MenuItems>
              <span onClick={logoutHandler}>
                <i
                  style={{ marginRight: 5 }}
                  className='fas fa-sign-out-alt'
                ></i>
                Sign out
              </span>
            </MenuItems>
            <IconButton
              mt={{ base: 2, md: 0 }}
              onClick={toggleColorMode}
              aria-label='Switch Theme'
              variant='unstyled'
              icon={
                <i
                  style={{
                    color: colorMode === 'light' ? 'yellow' : '#ffffff',
                  }}
                  className='fas fa-cloud-moon'
                ></i>
              }
            />
        </Flex>
      </Container>
    </Box>
  );
};

export default ClientNavbar;
