import { Box, Container, Flex, Heading } from '@chakra-ui/layout';
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
import MoonIconSelected from '../assets/icons/moon-icon-selected.svg';
import MoonIconNotSelected from '../assets/icons/moon-icon-not-selected.svg';
import SunnyIconSelected from '../assets/icons/sunny-icon-selected.svg';
import SunnyIconNotSelected from '../assets/icons/sunny-icon-not-selected.svg';
import SignOutIcon from '../assets/icons/sign-out-icon.svg';

const MenuItems = ({ children }) => (
  <Heading
    className='d-flex align-items-center'
    color='white'
    fontWeight='normal'
    letterSpacing=''
    fontSize='sm'
    cursor='pointer'
    mr={4}
    display='block'
  >
    {children}
  </Heading>
);

const ClientNavbar = () => {
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const [showMenu, setShow] = useState(false);

  const location = useLocation();

  const { colorMode, toggleColorMode } = useColorMode();

  const logoutHandler = () => {
    dispatch(clientLogout());
  };
  return (
    <Box
      className='navbar-dashboard'
      color='white'
      overflow='hidden'
      bg='#2a2f38'
      w='100%'
      p='4'
    >
      <Container maxW='container.xl' className='px-0 px-lg-3'>
        <Flex as='nav' className='navbar' justify='space-between' wrap='wrap'>
          <Box display='flex' alignItems='center'>
            <Logo />
            <span className='border-white-left-dashboard' />
            <h3 className='font-weight-lighter'>
              wallet
              <span className='font-weight-bold'>dashboard</span>
            </h3>
          </Box>
          <div className='wrapper-navbar'>
            <Box
              className='align-items-center'
              onClick={() => setShow(!showMenu)}
              display={{ base: 'flex', lg: 'none' }}
            >
              <i className='hamburger-menu fas fa-bars'></i>
            </Box>
            <Box
              className='items-navbar-wrapper pl-4'
              display={{ base: showMenu ? 'block' : 'none', lg: 'flex' }}
              alignItems='center'
            >
              <Link className='mr-3' to={`${path}/profile`}>
                <MenuItems>
                  {location.pathname === '/c/profile' ? (
                    <>
                      <img
                        className='mr-2'
                        src={DashboardSelected}
                        alt='Dashboard icon'
                        height='18'
                        width='18'
                      />
                      <span className='item-navbar'>
                        Dashboard
                        <span className='selected-item-navbar' />
                      </span>
                    </>
                  ) : (
                    <>
                      <img
                        className='mr-2'
                        src={DashboardNotSelected}
                        alt='Dashboard icon'
                        height='20'
                        width='20'
                      />
                      <span className='border-transparent'>Dashboard</span>
                    </>
                  )}
                </MenuItems>
              </Link>
              <Link className='mr-3' to={`/c/profile/withdraw`}>
                <MenuItems>
                  {location.pathname === '/c/profile/withdraw' ? (
                    <>
                      <img
                        className='mr-2'
                        src={WithdrawSelected}
                        alt='Withdraw icon'
                        height='20'
                        width='20'
                      />
                      <span className='item-navbar'>
                        Withdraw
                        <span className='selected-item-navbar' />
                      </span>
                    </>
                  ) : (
                    <>
                      <img
                        className='mr-2'
                        src={WithdrawNotSelected}
                        alt='Withdraw icon'
                        height='20'
                        width='20'
                      />
                      <span className='border-transparent'>Withdraw</span>
                    </>
                  )}
                </MenuItems>
              </Link>
              <Link to={`/c/profile/edit`}>
                <MenuItems>
                  {location.pathname === '/c/profile/edit' ? (
                    <div className='d-flex'>
                      <img
                        className='mr-2'
                        src={AccountSelected}
                        alt='Account icon'
                        height='20'
                        width='20'
                      />
                      <span className='item-navbar'>
                        My Account
                        <span className='selected-item-navbar' />
                      </span>
                    </div>
                  ) : (
                    <div className='d-flex'>
                      <img
                        className='mr-2'
                        src={AccountNotSelected}
                        alt='Account icon'
                        height='20'
                        width='20'
                      />
                      <span className='border-transparent'>My Account</span>
                    </div>
                  )}
                </MenuItems>
              </Link>
              <MenuItems>
                <span
                  className='d-flex d-lg-none mt-4 ml-1'
                  onClick={logoutHandler}
                >
                  <img
                    className='mr-1'
                    src={SignOutIcon}
                    alt='Account icon'
                    height='20'
                    width='20'
                  />
                  Sign out
                </span>
              </MenuItems>
            </Box>
            <div className='d-flex d-lg-none'>
              <MenuItems>
                <span className='d-none d-lg-flex align-items-center' onClick={logoutHandler}>
                  <img
                    className='mr-2'
                    src={SignOutIcon}
                    alt='Account icon'
                    height='20'
                    width='20'
                  />
                  Sign out
                </span>
              </MenuItems>
              <IconButton
                className='position-relative switch-theme-btn'
                onClick={toggleColorMode}
                aria-label='Switch Theme'
                icon={
                  <div>
                    {colorMode === 'light' ? (
                      <div>
                        <img
                          className='moon-icon'
                          src={MoonIconNotSelected}
                          height='17px'
                          width='17px'
                          alt='Dark Mode Not Selected'
                        />
                        <img
                          className='sunny-icon'
                          src={SunnyIconSelected}
                          height='17px'
                          width='17px'
                          alt='Light Mode Selected'
                        />
                      </div>
                    ) : (
                      <div>
                        <img
                          className='moon-icon'
                          src={MoonIconSelected}
                          height='17px'
                          width='17px'
                          alt='Dark Mode Selected'
                        />
                        <img
                          className='sunny-icon'
                          src={SunnyIconNotSelected}
                          height='17px'
                          width='17px'
                          alt='Light Mode Not Selected'
                        />
                      </div>
                    )}
                  </div>
                }
              />
            </div>
          </div>
          <div className='d-none d-lg-flex'>
            <MenuItems>
              <span className='d-none d-lg-flex mr-3' onClick={logoutHandler}>
                Sign out
                <img
                  className='ml-2'
                  src={SignOutIcon}
                  alt='Account icon'
                  height='20'
                  width='20'
                />
              </span>
            </MenuItems>
            <IconButton
              className='position-relative switch-theme-btn'
              onClick={toggleColorMode}
              aria-label='Switch Theme'
              icon={
                <div>
                  {colorMode === 'light' ? (
                    <div>
                      <img
                        className='moon-icon'
                        src={MoonIconNotSelected}
                        height='17px'
                        width='17px'
                        alt='Dark Mode Not Selected'
                      />
                      <img
                        className='sunny-icon'
                        src={SunnyIconSelected}
                        height='17px'
                        width='17px'
                        alt='Light Mode Selected'
                      />
                    </div>
                  ) : (
                    <div>
                      <img
                        className='moon-icon'
                        src={MoonIconSelected}
                        height='17px'
                        width='17px'
                        alt='Dark Mode Selected'
                      />
                      <img
                        className='sunny-icon'
                        src={SunnyIconNotSelected}
                        height='17px'
                        width='17px'
                        alt='Light Mode Not Selected'
                      />
                    </div>
                  )}
                </div>
              }
            />
          </div>
        </Flex>
      </Container>
    </Box>
  );
};

export default ClientNavbar;
