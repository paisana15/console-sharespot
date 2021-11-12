import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Heading, Box } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Button } from '@chakra-ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { passwordReset } from '../../redux/action/ClientAction';
import { useToast } from '@chakra-ui/toast';
import { Helmet } from 'react-helmet';

const ClientResetPasswordByAdmin = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const history = useHistory();

  const [preP, setPP] = useState('');
  const [newP, setNP] = useState('');
  const [conP, setCP] = useState('');

  const resetPassword = useSelector((state) => state.resetPassword);
  const { loading, error, success } = resetPassword;

  const { client } = useSelector((state) => state.singleClientsGet.clientData);

  console.log(client);

  useEffect(() => {
    if (success) {
      toast({
        title: 'Success!',
        status: 'success',
        description: 'Password Reset Sucessful!',
        duration: 5000,
        isClosable: true,
      });
      history.goBack();
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
  }, [history, success, error, toast]);

  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      preP,
      newP,
      conP,
    };
    if (client) {
      dispatch(passwordReset(client._id, data, true));
    }
  };
  return (
    <Box p='7'>
      <Helmet>
        <title>Client Reset Password</title>
      </Helmet>
      <Heading
        className='heading-dashboard mb-3 mt-2'
        fontSize='2xl'
        display='inline-block'
      >
        Client Reset Password
        <hr />
      </Heading>
      <Box>
        <form onSubmit={submitHandler}>
          <FormControl id='c_password' isRequired>
            <div className='d-flex mt-4 pt-3 mb-4 align-items-center'>
              <FormLabel className='font-weight-bold'>
                Current Password
              </FormLabel>
              <Input
                className='input-reset-password'
                value={preP}
                onChange={(e) => setPP(e.target.value)}
                type='password'
              />
            </div>
          </FormControl>
          <FormControl id='n_password' isRequired>
            <div className='d-flex mb-4 align-items-center'>
              <FormLabel className='font-weight-bold'>New Password</FormLabel>
              <Input
                className='input-reset-password'
                value={newP}
                onChange={(e) => setNP(e.target.value)}
                type='password'
              />
            </div>
          </FormControl>
          <FormControl id='nc_password' isRequired>
            <div className='d-flex mb-4 align-items-center'>
              <FormLabel className='font-weight-bold'>
                Confirm Password
              </FormLabel>
              <Input
                className='input-reset-password'
                value={conP}
                onChange={(e) => setCP(e.target.value)}
                type='password'
              />
            </div>
          </FormControl>
          <div className='d-flex mt-5 pt-3'>
            <Button
              className='primary-btn mr-4 ml-0'
              isLoading={loading}
              loadingText='Processing...'
              mt='2'
              type='submit'
            >
              Reset
            </Button>

            <Button
              className='back-btn ml-0'
              mt='2'
              onClick={() => history.goBack()}
            >
              Back
            </Button>
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default ClientResetPasswordByAdmin;
