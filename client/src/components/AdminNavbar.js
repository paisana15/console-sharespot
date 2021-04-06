import { Box, Container, Flex, Spacer, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { adminLogout } from '../redux/action/AdminAction';
import { useDispatch, useSelector } from 'react-redux';
import Logo from './Logo';
import { useColorMode } from '@chakra-ui/color-mode';
import { Button, IconButton } from '@chakra-ui/button';
import { getWithdrawalRequets } from '../redux/action/AdminAction';
import { Collapse } from '@chakra-ui/transition';

const MenuItems = ({ children }) => (
  <Text
    color='gray.500'
    fontWeight='semibold'
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

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const [showMenu, setShow] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  const withdrawRequestGet = useSelector((state) => state.withdrawRequestGet);
  const { wRequests } = withdrawRequestGet;

  useEffect(() => {
    dispatch(getWithdrawalRequets());
  }, [dispatch]);
  const logoutHandler = () => {
    dispatch(adminLogout());
  };
  return (
    <Box color='white' overflow='hidden' bg='#2a2f38' w='100%' p='4'>
      <Container maxW='container.xl'>
        <Box
          d={{ md: 'flex' }}
          as='nav'
          alignItems='center'
          justify='space-between'
          wrap='wrap'
        >
          <Flex>
            <Flex alignItems='center'>
              <Logo />
              <Text
                fontSize={{ base: 'md', sm: 'xl' }}
                fontStyle='oblique'
                fontWeight='bold'
                ml='2'
              >
                Sharespot Wallet
              </Text>
            </Flex>
            <Spacer />
            <Box display={{ base: 'block', md: 'none' }}>
              <Button
                variant='unstyled'
                colorScheme='gray'
                onClick={() => setShow(!showMenu)}
              >
                <i className='fas fa-bars'></i>
              </Button>
            </Box>
          </Flex>
          <Spacer />
          <Collapse in={showMenu} animateOpacity>
            <Box
              display={{ base: showMenu ? 'block' : 'none', md: 'flex' }}
              alignItems='center'
            >
              <Link to={path}>
                <MenuItems>
                  <i className='fas fa-users'></i> All Clients
                </MenuItems>
              </Link>
              <Link to={`${path}/add-hotspot`}>
                <MenuItems>
                  <i className='fas fa-wifi'></i> Add Hotspot
                </MenuItems>
              </Link>
              <Link to={`${path}/withdrawal-requests`}>
                <MenuItems>
                  <i className='fas fa-bell'></i> Withdrawal Request{' '}
                  <span style={{ color: wRequests?.length > 0 && '#ffcc59' }}>
                    {wRequests?.length > 0
                      ? `( ${wRequests?.length} )`
                      : `( 0 )`}
                  </span>
                </MenuItems>
              </Link>
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
            </Box>
          </Collapse>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminNavbar;
