import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Spacer, Text } from '@chakra-ui/layout';
import { useDispatch, useSelector } from 'react-redux';
import {
  getWithdrawalRequets,
  rejectWithdrawRequest,
  acceptWithdrawRequest,
} from '../redux/action/AdminAction';
import moment from 'moment';
import { useColorMode } from '@chakra-ui/color-mode';
import AlertMessage from '../components/Alert';
import Loader from '../components/Loader';
import { Button } from '@chakra-ui/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useToast } from '@chakra-ui/toast';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/hooks';

const WithdrawRequestScreen = () => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [wrId, setwrId] = useState('');

  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onAOpen,
    isOpen: isAOpen,
    onClose: onAClose,
  } = useDisclosure();

  const withdrawRequestGet = useSelector((state) => state.withdrawRequestGet);
  const { loading, wRequests, error } = withdrawRequestGet;

  const withdrawReject = useSelector((state) => state.withdrawReject);
  const {
    loading: rejectLoading,
    success: rejectSuccess,
    error: rejectError,
  } = withdrawReject;

  const withdrawAccept = useSelector((state) => state.withdrawAccept);
  const {
    loading: acceptLoading,
    success: acceptSuccess,
    error: acceptError,
  } = withdrawAccept;

  useEffect(() => {
    if (rejectSuccess) {
      onClose();
      toast({
        title: 'Success!',
        status: 'success',
        description: 'Withdraw request rejected!',
        duration: 3000,
        isClosable: true,
      });
    }
    if (rejectError) {
      onClose();
      toast({
        title: 'Failed!',
        status: 'error',
        description: rejectError,
        duration: 3000,
        isClosable: true,
      });
    }
    if (acceptSuccess) {
      onAClose();
      toast({
        title: 'Success!',
        status: 'success',
        description: 'Payment sent to client wallet!',
        duration: 3000,
        isClosable: true,
      });
    }
    if (acceptError) {
      onAClose();
      toast({
        title: 'Failed!',
        status: 'error',
        description: acceptError,
        duration: 3000,
        isClosable: true,
      });
    }
    dispatch(getWithdrawalRequets());
  }, [
    dispatch,
    rejectSuccess,
    rejectError,
    toast,
    onClose,
    onAClose,
    acceptError,
    acceptSuccess,
  ]);

  const rejectHandler = () => {
    dispatch(rejectWithdrawRequest(wrId));
  };
  const acceptHandler = () => {
    dispatch(acceptWithdrawRequest(wrId));
  };

  return (
    <Box p='4'>
      <Helmet>
        <title>Withdrawal Request | Admin Dashboard</title>
      </Helmet>
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
            <Box
              d={{ sm: 'flex' }}
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
                    onClick={() => {
                      onAOpen();
                      setwrId(data?._id);
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    colorScheme='red'
                    borderColor='red.400'
                    color='gray.500'
                    onClick={() => {
                      onOpen();
                      setwrId(data?._id);
                    }}
                  >
                    Reject
                  </Button>
                </Flex>
              </Flex>
            </Box>
          ))
        ) : (
          <AlertMessage
            status='error'
            error='No withdrawal requests available!'
          />
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Rejection</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                {'Are you sure you want to reject this withdraw request?'}
              </Text>
              {rejectLoading && <Loader />}
            </ModalBody>

            <ModalFooter>
              <Button
                variant='outline'
                colorScheme='blue'
                mr={3}
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                onClick={rejectHandler}
                colorScheme='red'
                variant='outline'
              >
                Yes, Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isAOpen} onClose={onAClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Accept Request</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                {'Are you sure you want to accept this withdraw request?'}
              </Text>
              {acceptLoading && <Loader />}
            </ModalBody>

            <ModalFooter>
              <Button
                variant='outline'
                colorScheme='blue'
                mr={3}
                onClick={onAClose}
              >
                Close
              </Button>
              <Button
                onClick={acceptHandler}
                colorScheme='red'
                variant='outline'
              >
                Yes, Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default WithdrawRequestScreen;
