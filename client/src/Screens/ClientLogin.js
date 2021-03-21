import React, { useEffect, useState } from 'react';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { FormLabel } from '@chakra-ui/form-control';
import { Box, Button, Heading, useColorMode, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { clientLogin } from '../redux/action/ClientAction';
import AlertMessage from '../components/Alert';
import { useHistory } from 'react-router';

const ClientLogin = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const history = useHistory();

  const loginClient = useSelector((state) => state.loginClient);
  const { loading, isAuthenticated, error } = loginClient;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      toast({
        title: 'Successfully Signed in!',
        status: 'success',
        isClosable: true,
        duration: 5000,
      });
      history.push('/c');
    }
  }, [history, toast, isAuthenticated]);
  const submitHandler = (e) => {
    e.preventDefault();
    const credentials = { username, password };
    dispatch(clientLogin(credentials));
  };

  return (
    <div>
      <Box
        shadow='md'
        m='auto'
        mt='5'
        w='400px'
        p='4'
        borderWidth='1px'
        borderRadius='lg'
      >
        <Heading
          as='h5'
          size='lg'
          color={`${colorMode === 'dark' ? '#7e838c' : 'gray.700'}`}
          mb='3'
        >
          Client Login
        </Heading>
        <form onSubmit={submitHandler}>
          <FormControl id='first-name' isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter username'
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
          {error && <AlertMessage status='error' error={error} />}
        </Box>
      </Box>
    </div>
  );
};

export default ClientLogin;
