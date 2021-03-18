import React, { useState } from 'react';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { FormLabel } from '@chakra-ui/form-control';
import { Box, Button, Heading } from '@chakra-ui/react';

const AdminLogin = () => {
  const [load, setLoad] = useState(false);
  return (
    <div>
      <Box
        shadow='md'
        m='auto'
        mt='5'
        w='50%'
        p='4'
        borderWidth='1px'
        borderRadius='lg'
      >
        <Heading as='h4' size='lg' color='gray.700' mb='3'>
          Admin Login
        </Heading>
        <FormControl id='first-name' isRequired>
          <FormLabel>Username</FormLabel>
          <Input placeholder='Enter Username' />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input pr='4.5rem' type='password' placeholder='Enter password' />
        </FormControl>
        <Button
          isLoading={load}
          loadingText='Signing in...'
          colorScheme='green'
          variant='solid'
          mt='5'
        >
          Sign in
        </Button>
      </Box>
    </div>
  );
};

export default AdminLogin;
