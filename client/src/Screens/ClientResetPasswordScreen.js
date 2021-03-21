import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Button } from '@chakra-ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { passwordReset } from '../redux/action/ClientAction';
import { useToast } from '@chakra-ui/toast';

const ClientResetPasswordScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [preP, setPP] = useState('');
  const [newP, setNP] = useState('');
  const [conP, setCP] = useState('');

  const resetPassword = useSelector((state) => state.resetPassword);
  const { loading, error, success } = resetPassword;

  const loginClient = useSelector((state) => state.loginClient);
  const { cInfo } = loginClient;

  useEffect(() => {
    if (success) {
      toast({
        title: 'Success!',
        status: 'success',
        description: 'Password Reset Sucessfull!',
        duration: 5000,
        isClosable: true,
      });
    }
    if (error) {
      toast({
        title: 'Failed!',
        status: 'error',
        description: error,
        duration: 5000,
        isClosable: true,
      });
    }
  }, [success, error, toast]);

  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      preP,
      newP,
      conP,
    };
    dispatch(passwordReset(cInfo?._id, data));
  };
  return (
    <Box>
      <Text fontSize='2xl' display='inline-block' className='adminPageHeader'>
        Reset Password
      </Text>
      <form onSubmit={submitHandler}>
        <FormControl id='c_password' isRequired>
          <FormLabel>Current Password</FormLabel>
          <Input
            value={preP}
            onChange={(e) => setPP(e.target.value)}
            type='password'
          />
        </FormControl>
        <FormControl id='n_password' isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            value={newP}
            onChange={(e) => setNP(e.target.value)}
            type='password'
          />
        </FormControl>
        <FormControl id='nc_password' isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            value={conP}
            onChange={(e) => setCP(e.target.value)}
            type='password'
          />
        </FormControl>
        <Button
          isLoading={loading}
          loadingText='Processing...'
          mt='2'
          type='submit'
          variant='outline'
          colorScheme='blue'
          color='blue.400'
        >
          Reset
        </Button>
      </form>
    </Box>
  );
};

export default ClientResetPasswordScreen;
