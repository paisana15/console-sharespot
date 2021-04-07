import React, { useEffect } from 'react';
import { Badge, Box, Flex, Spacer, Text } from '@chakra-ui/layout';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
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
    if (wHistories && wHistories?.length < 1) {
      dispatch(getWithdrawHistoryByC(cInfo?._id));
    }
  }, [success, error, toast, cInfo?._id, dispatch, wHistories]);
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
    <Box p='4'>
      <Helmet>
        <title>Withdraw Rewards</title>
      </Helmet>
      <Box d={{ md: 'flex' }} mb='3' alignItems='center'>
        <Text fontSize={{ base: '1xl', sm: '2xl' }} className='adminPageHeader'>
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
              HNT {(wallet?.totalRewards - wallet?.totalWithdraw).toFixed(2)}
            </Badge>
          </Text>
        </Box>
      </Box>
      <Box d={{ md: 'flex' }} mt='3'>
        <Box w={{ base: '100%', md: '30%' }}>
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
                  <FormLabel>Amount</FormLabel>
                  <Input
                    name='amount'
                    placeholder='Enter withdrawal amount'
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isDisabled={wallet?.pendingPayment > 0}
                  />
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
                  mt='3'
                  type='submit'
                  colorScheme='teal'
                  size='sm'
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
        <Box mt={{ base: '3', md: 0 }} w={{ base: '100%', md: '60%' }}>
          <Text
            borderBottom='1px'
            borderColor='gray.400'
            mb='2'
            fontStyle='oblique'
            paddingBottom='1.5'
            textColor='#aaa'
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
                  p='2'
                  px='4'
                  borderRadius='lg'
                  mb='3'
                  boxShadow='base'
                  bg={colorMode === 'light' ? '#f4f5f7' : '#303744'}
                >
                  <Box>
                    <Text fontSize='sm'>
                      {moment(data?.createdAt).format('LLL')}
                    </Text>
                    <Box>
                      <Badge
                        variant={colorMode === 'light' ? 'solid' : 'outline'}
                        colorScheme={
                          data?.status === 'Pending'
                            ? 'orange'
                            : data?.status === 'Rejected'
                            ? 'red'
                            : data?.status === 'Confirmed'
                            ? 'green'
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
                      <Text fontSize='sm' color='grey'>
                        Amount
                      </Text>
                      <Text
                        fontWeight='bold'
                        color={colorMode === 'light' ? 'grey' : 'orange.200'}
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
