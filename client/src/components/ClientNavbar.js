import { Box, Container, Flex, Text } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { Link, useRouteMatch, useLocation } from 'react-router-dom';
import { clientLogout } from '../redux/action/ClientAction';
import { useDispatch } from 'react-redux';
import Logo from './Logo';
import { useColorMode } from '@chakra-ui/color-mode';
import { IconButton } from '@chakra-ui/button';
import DashboardSelected from '../assets/icons/dashboard-icon-selected.svg';
import DashboardNotSelected from '../assets/icons/dashboard-icon-not-selected.svg';
import WithdrawSelected from '../assets/icons/withdraw-icon-selected.svg';
import WithdrawNotSelected from '../assets/icons/withdraw-icon-not-selected.svg';
import AccountSelected from '../assets/icons/account-icon-selected.svg';
import AccountNotSelected from '../assets/icons/account-icon-not-selected.svg';

const MenuItems = ({ children }) => (
  <Text
    className='d-flex align-items-center'
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

  const location = useLocation();
  console.log(location.pathname);

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
              {location.pathname === '/c/profile' ? 
                  <>
                    <img className='mr-2' src={DashboardSelected} alt='Dashboard icon' height='20' width='20'/>
                    <span className='item-navbar'>Dashboard<span className='selected-item-navbar'/></span>
                  </>
                  :   
                  <>
                    <img className='mr-2' src={DashboardNotSelected} alt='Dashboard icon' height='20' width='20'/>
                    <span>Dashboard</span>
                  </>
                }
              </MenuItems>
            </Link>
            <Link to={`/c/profile/withdraw`}>
              <MenuItems>
                {location.pathname === '/c/profile/withdraw' ? 
                  <>
                    <img className='mr-2' src={WithdrawSelected} alt='Withdraw icon' height='20' width='20'/>
                    <span className='item-navbar'>Withdraw<span className='selected-item-navbar'/></span>
                  </>
                  :   
                  <>
                    <img className='mr-2' src={WithdrawNotSelected} alt='Withdraw icon' height='20' width='20'/>
                    <span>Withdraw</span>
                  </>
                }
              </MenuItems>
            </Link>
             <Link to={`/c/profile/edit`}>
             
              <MenuItems>
                {location.pathname === '/c/profile/edit' ? 
                  <>
                   <img className='mr-2' src={AccountSelected} alt='Account icon' height='20' width='20'/>
                   <span className='item-navbar'>My Account<span className='selected-item-navbar'/></span>
                  </>
                  :   
                  <>
                    <img className='mr-2' src={AccountNotSelected} alt='Account icon' height='20' width='20'/>
                    <span>My Account</span>
                  </>
                } 
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
