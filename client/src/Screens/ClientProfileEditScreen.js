import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import MyTextField from '../components/MyTextField';
import { Box, Button, Text } from '@chakra-ui/react';

const ClientProfileEditScreen = () => {
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
            firstname: '',
            lastname: '',
            email: '',
            username: '',
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

export default ClientProfileEditScreen;
