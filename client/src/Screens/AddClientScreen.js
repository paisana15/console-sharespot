import React from 'react';
import { Box, Heading } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Formik } from 'formik';
import * as yup from 'yup';
import MyTextField from '../components/MyTextField';

const AddClientScreen = () => {
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
      <Heading size='lg'>Add New Client</Heading>
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
          onSubmit={(data, { setSubmitting }) => {
            console.log(data);
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <MyTextField type='text' label='First Name' name='firstname' />
              <MyTextField type='text' label='Last name' name='lastname' />
              <MyTextField type='email' label='Email' name='email' />
              <MyTextField type='text' label='Username' name='username' />
              <MyTextField type='password' label='Password' name='password' />
              <MyTextField
                type='text'
                label='Phone Number'
                name='phone_number'
              />
              <MyTextField
                type='text'
                label='Wallet Address'
                name='wallet_address'
              />

              <Button
                mt='2'
                type='submit'
                disabled={isSubmitting}
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
