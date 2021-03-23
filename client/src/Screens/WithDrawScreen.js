import React, { useEffect } from 'react';
import { Badge, Box, Flex, Spacer, Text } from '@chakra-ui/layout';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { withdrawRequestByClient } from '../redux/action/ClientAction';
import { Helmet } from 'react-helmet';

const WithDrawScreen = ({ client, wallet }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const requestWithdraw = useSelector((state) => state.requestWithdraw);
  const { loading, success, error } = requestWithdraw;

  useEffect(() => {
    if (success) {
      toast({
        status: 'success',
        title: 'Success!',
        description: 'Withdraw Request Received!',
        duration: 3000,
        isClosable: true,
      });
    }
    if (error) {
      toast({
        status: 'error',
        title: 'Failed!',
        description: error,
        duration: 3000,
        isClosable: true,
      });
    }
  }, [success, error, toast]);
  const fieldValidationSchema = yup.object({
    amount: yup
      .number()
      .max(
        wallet?.wallet_balance,
        `Available for withdraw ${wallet?.totalRewards - wallet?.totalWithdraw}`
      )
      .min(10, 'Min withdraw 10 HNT!')
      .required('Amount Required!'),
  });

  return (
    <Box p='4'>
      <Helmet>
        <title>Withdraw Rewards</title>
      </Helmet>
      <Flex mb='3' alignItems='center'>
        <Text fontSize='2xl' className='adminPageHeader'>
          Withdraw Reward
        </Text>
        <Spacer />
        <Box>
          <Text
            textTransform='uppercase'
            d='flex'
            alignItems='center'
            fontSize='sm'
          >
            Available for Withdraw :{' '}
            <Badge ml='2' variant='outline' colorScheme='green'>
              HNT {wallet?.totalRewards - wallet?.totalWithdraw}
            </Badge>
          </Text>
        </Box>
      </Flex>
      <Box mt='3'>
        <Formik
          initialValues={{
            amount: '',
          }}
          validationSchema={fieldValidationSchema}
          onSubmit={(data) => {
            dispatch(withdrawRequestByClient(client?._id, data));
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input
                  name='amount'
                  placeholder='Enter withdrawal amount'
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.amount && touched.amount && (
                  <div style={{ color: 'red', fontSize: 13 }}>
                    {errors.amount}
                  </div>
                )}
              </FormControl>
              <Button
                isLoading={loading}
                loadingText='Processing...'
                mt='3'
                type='submit'
                colorScheme='facebook'
              >
                Request Withdraw
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default WithDrawScreen;
