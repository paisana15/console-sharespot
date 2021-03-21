import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import MyTextField from '../components/MyTextField';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateClientByClient } from '../redux/action/ClientAction';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const ClientProfileEditByClient = ({ client_details }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const history = useHistory();
  const updateClientByC = useSelector((state) => state.updateClientByC);
  const { loading, success, error } = updateClientByC;

  useEffect(() => {
    if (success) {
      toast({
        title: 'Success!',
        status: 'success',
        description: 'Profile Updated!',
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
  }, [history, toast, success, error, client_details]);

  const fieldValidationSchema = yup.object({
    firstname: yup
      .string()
      .max(10, 'Max 10 Character!')
      .min(1, 'Min 1 Character!')
      .required('First name required!'),
    lastname: yup
      .string()
      .max(10, 'Max 10 Character!')
      .min(1, 'Min 1 Character!')
      .required('Last name required!'),
    email: yup.string().email().required('Email required!'),
    username: yup
      .string()
      .max(15, 'Max 15 Character!')
      .min(5, 'Min 5 Character!')
      .required('Username required!'),
    phone_number: yup
      .string()
      .max(15, 'Max 15 Character!')
      .min(11, 'Min 11 Charecter!')
      .required('Phone number required!'),
    wallet_address: yup.string().required('Wallet address required!'),
  });
  return (
    <Box p='4'>
      <Text fontSize='2xl' display='inline-block' className='adminPageHeader'>
        Edit Client
      </Text>
      <Box mt='3'>
        <Formik
          initialValues={{
            firstname: client_details?.client?.firstname,
            lastname: client_details?.client?.lastname,
            email: client_details?.client?.email,
            username: client_details?.client?.username,
            phone_number: client_details?.client?.phone_number,
            wallet_address: client_details?.client?.wallet_address,
          }}
          validationSchema={fieldValidationSchema}
          onSubmit={(data) => {
            dispatch(updateClientByClient(client_details?.client?._id, data));
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <MyTextField
                placeholder='Client first name'
                type='text'
                label='First Name'
                name='firstname'
              />
              <MyTextField
                placeholder='Client last name'
                type='text'
                label='Last name'
                name='lastname'
              />
              <MyTextField
                placeholder='Client email'
                type='email'
                label='Email'
                name='email'
              />
              <MyTextField
                placeholder='Choose a username'
                type='text'
                label='Username'
                name='username'
              />
              <MyTextField
                type='text'
                label='Phone Number'
                name='phone_number'
                placeholder='Client phone number'
              />
              <MyTextField
                type='text'
                label='Wallet Address'
                name='wallet_address'
                placeholder='Choose wallet address'
              />

              <Button
                mt='2'
                type='submit'
                isLoading={loading}
                loadingText='Updating...'
                colorScheme='facebook'
              >
                Update
              </Button>
              <Link to={`/c/reset-password`}>
                <Button mt='2' ml='2' variant='outline' colorScheme='whatsapp'>
                  Reset Password
                </Button>
              </Link>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ClientProfileEditByClient;
