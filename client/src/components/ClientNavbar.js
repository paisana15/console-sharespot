import { Box, Container, Flex, Spacer, Text } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { clientLogout } from '../redux/action/ClientAction';
import { useDispatch } from 'react-redux';
import Logo from './Logo';
import { useColorMode } from '@chakra-ui/color-mode';
import { Button, IconButton } from '@chakra-ui/button';
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

const ClientNavbar = () => {
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const [showMenu, setShow] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();

  const logoutHandler = () => {
    dispatch(clientLogout());
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
              <Link to={`${path}/profile`}>
                <MenuItems>
                  <i className='fas fa-user'></i> My Account
                </MenuItems>
              </Link>
              <Link to={`/c/profile/withdraw`}>
                <MenuItems>
                  <i className='fas fa-money-check-alt'></i> Withdraw
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

export default ClientNavbar;
