import React, { useEffect, useState } from 'react';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { FormLabel } from '@chakra-ui/form-control';
import { Alert, AlertIcon, Box, Button, Heading } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../redux/action/AdminAction';

const AdminLogin = ({ history }) => {
  const dispatch = useDispatch();

  const loginAdmin = useSelector((state) => state.loginAdmin);
  const { loading, isAuthenticated, error } = loginAdmin;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/h');
    }
  }, [history, isAuthenticated]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(username, password));
  };

  return (
    <div>
      <Box
        shadow='md'
        m='auto'
        mt='5'
        w='20%'
        p='4'
        borderWidth='1px'
        borderRadius='lg'
      >
        <Heading as='h4' size='lg' color='gray.700' mb='3'>
          Admin Login
        </Heading>
        <form onSubmit={submitHandler}>
          <FormControl id='first-name' isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter Username'
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              pr='4.5rem'
              type='password'
              placeholder='Enter password'
            />
          </FormControl>
          <Button
            type='submit'
            isLoading={loading}
            loadingText='Signing in...'
            colorScheme='purple'
            variant='solid'
            mt='5'
          >
            Sign in
          </Button>
        </form>
        <Box mt='3'>
          {error && (
            <Alert status='error'>
              <AlertIcon />
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default AdminLogin;
