import React, { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Formik } from 'formik';
import * as yup from 'yup';
import MyTextField from '../components/MyTextField';
import { addNewClient } from '../redux/action/AdminAction';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/toast';

const AddClientScreen = ({ history }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const newClientAdd = useSelector((state) => state.newClientAdd);
  const { loading, success, error } = newClientAdd;

  useEffect(() => {
    if (success) {
      toast({
        title: 'Success!',
        status: 'success',
        description: 'New Client Added!',
        duration: 5000,
        isClosable: true,
      });
      history.push('/h/clients');
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
  }, [error, history, success, toast]);

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
    password: yup
      .string()
      .max(12, 'Max 12 Character!')
      .min(6, 'Min 6 Character!')
      .required('Password required!'),
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
        Add New Client
      </Text>
      <Box mt='3'>
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            password: '',
            phone_number: '',
            wallet_address: '',
          }}
          validationSchema={fieldValidationSchema}
          onSubmit={(data, { resetForm }) => {
            dispatch(addNewClient(data));
            if (success) {
              resetForm();
            }
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <MyTextField
                type='text'
                placeholder='Client first name'
                label='First Name'
                name='firstname'
              />
              <MyTextField
                type='text'
                placeholder='Client last name'
                label='Last name'
                name='lastname'
              />
              <MyTextField
                type='email'
                placeholder='Client email address'
                label='Email'
                name='email'
              />
              <MyTextField
                type='text'
                placeholder='Choose a username for client'
                label='Username'
                name='username'
              />
              <MyTextField
                type='password'
                label='Password'
                placeholder='Choose a password'
                name='password'
              />
              <MyTextField
                placeholder='Client phone number'
                type='text'
                label='Phone Number'
                name='phone_number'
              />
              <MyTextField
                type='text'
                placeholder='Client wallet address'
                label='Wallet Address'
                name='wallet_address'
              />

              <Button
                isLoading={loading}
                mt='2'
                type='submit'
                colorScheme='facebook'
              >
                Add Client
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default AddClientScreen;
