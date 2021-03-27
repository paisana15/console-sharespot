import { Box, Container, Flex, Text } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { adminLogout } from '../redux/action/AdminAction';
import { useDispatch } from 'react-redux';
import Logo from './Logo';
import { useColorMode } from '@chakra-ui/color-mode';

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

  const logoutHandler = () => {
    dispatch(adminLogout());
  };
  return (
    <Box color='white' overflow='hidden' bg='#2a2f38' w='100%' p='4'>
      <Container maxW='container.xl'>
        <Flex as='nav' align='center' justify='space-between' wrap='wrap'>
          <Box display='flex' alignItems='center'>
            <Logo />
            <Text fontSize='xl' fontStyle='oblique' fontWeight='bold' ml='2'>
              Sharespot Wallet
            </Text>
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
            <Link to={path}>
              <MenuItems>
                <i className='fas fa-users'></i> All CLients
              </MenuItems>
            </Link>
            <Link to={`${path}/add-hotspot`}>
              <MenuItems>
                <i className='fas fa-wifi'></i> Add Hotspot
              </MenuItems>
            </Link>
            <Link to={`${path}/withdrawal-requests`}>
              <MenuItems>
                <i className='fas fa-bell'></i> Withdrawal Request
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
              mt={{ base: '2', sm: '2', md: 0 }}
              alignItems='center'
              justifyContent='center'
              color={`${colorMode === 'light' ? 'yellow.300' : 'white'}`}
              onClick={toggleColorMode}
            >
              <i className='fas fa-cloud-moon'></i>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default AdminNavbar;
