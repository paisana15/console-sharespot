import React, { useEffect } from 'react';
import { Box, Flex, Heading, Spacer, Text } from '@chakra-ui/layout';
import { useDispatch, useSelector } from 'react-redux';
import { getWithdrawalRequets } from '../redux/action/AdminAction';
import moment from 'moment';
import { useColorMode } from '@chakra-ui/color-mode';
import AlertMessage from '../components/Alert';
import Loader from '../components/Loader';
import { Button } from '@chakra-ui/button';
import { Link } from 'react-router-dom';

const WithdrawRequestScreen = () => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();

  useEffect(() => {
    dispatch(getWithdrawalRequets());
  }, [dispatch]);

  const withdrawRequestGet = useSelector((state) => state.withdrawRequestGet);
  const { loading, wRequests, error } = withdrawRequestGet;

  return (
    <Box p='4'>
      <Text fontSize='2xl' display='inline-block' className='adminPageHeader'>
        Withdrawal Requests ({wRequests?.length})
      </Text>
      <Box mt='3'>
        {loading ? (
          <Loader />
        ) : error ? (
          <AlertMessage status='error' error={error} />
        ) : wRequests?.length > 0 ? (
          wRequests?.map((data) => (
            <Flex
              key={data?._id}
              p='4'
              borderRadius='lg'
              mb='3'
              boxShadow='base'
              bg={colorMode === 'light' ? '#f4f5f7' : '#303744'}
            >
              <Box>
                <Link to={`/h/client/${data?.client?._id}`}>
                  <Heading size='sm'>
                    {data?.client?.firstname + ' ' + data?.client?.lastname}
                  </Heading>
                </Link>
                <Flex mt='2'>
                  <Text textTransform='' fontSize='xs'>
                    <i className='far fa-clock '></i>{' '}
                    {moment(data?.createdAt).format('LLL')}
                  </Text>
                </Flex>
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

                <Flex>
                  <Button
                    size='sm'
                    colorScheme='teal'
                    variant='outline'
                    borderColor='teal'
                    mr='2'
                    color='gray.500'
                  >
                    Accept
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    colorScheme='red'
                    borderColor='red.400'
                    color='gray.500'
                  >
                    Reject
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          ))
        ) : (
          <AlertMessage
            status='error'
            error='No withdrawal requests available!'
          />
        )}
      </Box>
    </Box>
  );
};

export default WithdrawRequestScreen;
