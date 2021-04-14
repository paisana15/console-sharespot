import React, { useEffect } from 'react';
import { Badge, Box, Flex, Spacer, Text } from '@chakra-ui/layout';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  FormControl,
  Input,
  Heading,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getWithdrawHistoryByC,
  withdrawRequestByClient,
} from '../redux/action/ClientAction';
import { Helmet } from 'react-helmet';
import Loader from '../components/Loader';
import AlertMessage from '../components/Alert';
import moment from 'moment';

const WithDrawScreen = ({ wallet }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const requestWithdraw = useSelector((state) => state.requestWithdraw);
  const { loading, success, error } = requestWithdraw;

  const loginClient = useSelector((state) => state.loginClient);
  const { cInfo } = loginClient;

  const histtoryWByc = useSelector((state) => state.histtoryWByc);
  const {
    loading: historyLoading,
    wHistories,
    error: historyError,
  } = histtoryWByc;

  useEffect(() => {
    if (success) {
      toast({
        status: 'success',
        title: 'Success!',
        description: 'Withdraw Request Received! Wait for Admin approval!',
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

    dispatch(getWithdrawHistoryByC(cInfo?._id));
  }, [success, error, toast, cInfo?._id, dispatch]);
  const fieldValidationSchema = yup.object({
    amount: yup
      .number()
      .max(
        wallet?.wallet_balance,
        `Available for withdraw ${wallet?.totalRewards - wallet?.totalWithdraw}`
      )
      .min(1, 'Min withdraw 1 HNT!')
      .required('Amount Required!'),
  });

  return (
    <Box className='p-0'>
      <Helmet>
        <title>Request Withdraw</title>
      </Helmet>
      <Box
        className='withdraw-container'
        d={{ md: 'flex' }}
        mb='3'
        alignItems='center'
      >
        <Heading
          className='title-underline'
          textColor={`${colorMode === 'light' ? '#0E0C1C' : 'white'}`}
          size='lg'
          mb='1'
        >
          Request Withdraw
          <hr />
        </Heading>
        <div className='d-flex flex-column available-container my-4 py-4'>
          <div className='mx-auto'>
            <h5 className='total-text'>Withdraw Available</h5>
            <Box bg={colorMode === 'light' ? '#fff' : '#0E0C1C'}></Box>
            <Text style={{ fontWeight: 'bold' }} fontSize='2xl'>
              {(wallet?.totalRewards - wallet?.totalWithdraw).toFixed(2)}
              &nbsp;HNT
            </Text>
          </div>
        </div>
      </Box>
      <Box d={{ md: 'flex' }} mt='3'>
        <Box className='mb-5 mt-5' w={{ base: '100%', md: '30%' }}>
          <Formik
            initialValues={{
              amount: '',
            }}
            validationSchema={fieldValidationSchema}
            onSubmit={(data) => {
              dispatch(withdrawRequestByClient(cInfo?._id, data));
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
                  {/* <FormLabel>Amount</FormLabel> */}
                  <Text
                    className='mb-4'
                    fontWeight='semibold'
                    color={colorMode === 'light' ? '#0E0C1C' : 'white'}
                    fontSize='lg'
                  >
                    Amount
                  </Text>
                  <div className='position-relative'>
                    <Input
                      className='border-bottom-gray input-insert-withdraw'
                      name='amount'
                      placeholder='Insert amount'
                      value={values.amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isDisabled={wallet?.pendingPayment > 0}
                    />
                    <Text
                      className='value-unit'
                      color={colorMode === 'light' ? '#0E0C1C' : '#CECECE'}
                    >
                      HNT
                    </Text>
                  </div>
                  {errors.amount && touched.amount && (
                    <div style={{ color: 'red', fontSize: 13 }}>
                      {errors.amount}
                    </div>
                  )}
                  <Text fontSize='sm' textColor='orange.500'>
                    {wallet?.pendingPayment > 0 &&
                      `You have pending withdraw request for HNT ${wallet?.pendingPayment}!`}
                  </Text>
                </FormControl>
                <Button
                  w={{ base: '100%', md: 'auto' }}
                  isLoading={loading}
                  loadingText='Processing...'
                  mt='2'
                  className='primary-btn mr-4 ml-0 mt-3'
                  type='submit'
                  size='md'
                  variant='outline'
                  isDisabled={wallet?.pendingPayment > 0}
                >
                  Request Withdraw
                </Button>
              </form>
            )}
          </Formik>
        </Box>
        <Spacer />
        <Box className='mb-5' w={{ base: '100%', md: '60%' }}>
          <Text
            className='mt-5 pt-3 mb-4 font-weight-bold withdraw-history'
            color={colorMode === 'light' ? '#0E0C1C' : 'white'}
          >
            Withdraw History
          </Text>
          <Box className='assigned_hotspot_wrapper'>
            {historyLoading ? (
              <Loader />
            ) : historyError ? (
              <AlertMessage status='error' error={historyError} />
            ) : wHistories && wHistories?.length > 0 ? (
              wHistories.map((data, idx) => (
                <Flex
                  key={idx}
                  borderRadius='20px'
                  className='mb-4 px-4 py-3'
                  boxShadow='base'
                  bg={colorMode === 'light' ? '#F6F6F6' : '#1D1A30'}
                >
                  <Box>
                    <Text className='mb-2' fontWeight='normal' fontSize='sm'>
                      {moment(data?.createdAt).format('LLL')}
                    </Text>
                    <Box>
                      <Badge
                        fontWeight='normal'
                        className='px-3 py-1'
                        borderRadius='24px'
                        color='white'
                        bg={
                          data?.status === 'Pending'
                            ? '#F9A518'
                            : data?.status === 'Rejected'
                            ? '#F9183E'
                            : data?.status === 'Confirmed'
                            ? '#44BBA4'
                            : 'purple'
                        }
                      >
                        {data?.status === 'Pending'
                          ? 'Pending'
                          : data?.status === 'Confirmed'
                          ? 'Confirmed'
                          : data?.status === 'Rejected'
                          ? 'Rejected'
                          : 'Manual'}
                      </Badge>
                    </Box>
                  </Box>
                  <Spacer />
                  <Flex textAlign='right' alignItems='center'>
                    <Box mr='2'>
                      <Text
                        fontWeight='lighter'
                        fontSize='sm'
                        color={colorMode === 'light' ? '#0E0C1C' : '#FFFFFF'}
                      >
                        Amount
                      </Text>
                      <Text
                        fontWeight='bold'
                        color={colorMode === 'light' ? '#0E0C1C' : '#FFF'}
                        fontSize='sm'
                      >
                        HNT {data?.amount?.toFixed(2)}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              ))
            ) : (
              <AlertMessage status='error' error='No withdraw history!' />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WithDrawScreen;
