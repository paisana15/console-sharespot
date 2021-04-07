import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import MyTextField from '../components/MyTextField';
import { Heading, Box, Button, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateClientByClient } from '../redux/action/ClientAction';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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
      .max(15, 'Max 15 Character!')
      .min(1, 'Min 1 Character!')
      .required('First name required!'),
    lastname: yup
      .string()
      .max(15, 'Max 15 Character!')
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
      <Helmet>
        <title>Profile Update</title>
      </Helmet>
      <Heading
        className='heading-dashboard'
        fontSize='2xl'
        display='inline-block'
      >
        Edit Profile
        <hr/>
      </Heading>
      <Box className='mt-5'>
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
                // textColor={`${colorMode === 'light' ? 'gray.600' : '#b3bfd4'}`}
                className='border-bottom-gray'
                placeholder='Choose a username'
                type='text'
                label='Username'
                name='username'
              />
              <MyTextField
                className='border-bottom-gray'
                placeholder='Client first name'
                type='text'
                label='First Name'
                name='firstname'
              />
              <MyTextField
                className='border-bottom-gray'
                placeholder='Client last name'
                type='text'
                label='Last name'
                name='lastname'
              />
              <MyTextField
                className='border-bottom-gray'
                placeholder='Client email'
                type='email'
                label='Email'
                name='email'
              />
              <MyTextField
                className='border-bottom-gray'
                type='text'
                label='Phone'
                name='phone_number'
                placeholder='Client phone number'
              />
              <div className='d-flex flex-column'>
                <MyTextField
                  className='wallet-address-input mb-0'
                  type='text'
                  label='Wallet Address'
                  name='wallet_address'
                  placeholder='Choose wallet address'
                />
                <div className='d-flex id-container'>
                  <span className='white-space'></span>
                  <span className='change-id'>
                    (if you want to change your wallet ID, please reach us at
                    support@sharespot.pt)
                  </span>
                </div>
              </div>
              <div className='d-flex mt-5 pt-3'>
                <Button
                  mt='2'
                  className='primary-btn mr-4 ml-0'
                  type='submit'
                  isLoading={loading}
                  loadingText='Updating...'
                >
                  Update
                </Button>
                <Link className='underline-none' to={`/c/reset-password`}>
                  <Button className='reset-btn mt-3'>reset password</Button>
                </Link>
              </div>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ClientProfileEditByClient;