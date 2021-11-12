import React, { useEffect, useState } from 'react';
import { Badge, Box, Flex, Heading, Spacer, Text } from '@chakra-ui/layout';
import { useDispatch, useSelector } from 'react-redux';
import {
  rejectWithdrawRequest,
  acceptWithdrawRequest,
  acceptMultipleWithdrawRequests,
} from '../../redux/action/AdminAction';
import moment from 'moment';
import { useColorMode } from '@chakra-ui/color-mode';
import AlertMessage from '../../components/Alert';
import Loader from '../../components/Loader';
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
import { Image } from '@chakra-ui/image';
import axios from 'axios';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import QRCode from 'qrcode.react';

const WithdrawRequestScreen = () => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [wrId, setwrId] = useState('');
  const [qrCode, setQRCode] = useState('');
  const [pendingTransactions, setPendingTransaction] = useState([]);
  const [pendingTLoading, setPendingLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [withdrawRequests, setWithdrawRequests] = useState({
    type: 'payment',
    payees: {},
  });

  const {
    loading: multipleWRAcceptLoading,
    success: multipleWRAcceptSuccess,
    error: multipleWRAcceptError,
  } = useSelector((state) => state.multipleWithdrawRequestsAccept);

  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onAOpen,
    isOpen: isAOpen,
    onClose: onAClose,
  } = useDisclosure();
  const {
    onOpen: onQROpen,
    isOpen: isQROpen,
    onClose: onQRClose,
  } = useDisclosure();
  const {
    onOpen: onMultiQROpen,
    isOpen: isMultiQROpen,
    onClose: onMultiQRClose,
  } = useDisclosure();

  const withdrawRequestGet = useSelector((state) => state.withdrawRequestGet);
  const { loading, wRequests, error } = withdrawRequestGet;

  const withdrawReject = useSelector((state) => state.withdrawReject);
  const {
    loading: rejectLoading,
    success: rejectSuccess,
    error: rejectError,
  } = withdrawReject;

  const {
    loading: acceptLoading,
    success: acceptSuccess,
    error: acceptError,
  } = useSelector((state) => state.withdrawAccept);

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
        description: 'Withdraw request accepted! An email was sent to  client.',
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
    return () => {};
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

  useEffect(() => {
    if (wRequests) {
      const objects = {};
      for (const req of wRequests) {
        objects[req.client.wallet_address] = req.amount;
      }
      setWithdrawRequests((prev) => ({ ...prev, payees: objects }));
    }
  }, [wRequests]);

  useEffect(() => {
    if (multipleWRAcceptSuccess) {
      onMultiQRClose();
    }
    if (multipleWRAcceptError) {
      onMultiQRClose();
      toast({
        title: 'Failed!',
        status: 'error',
        description: multipleWRAcceptError,
        duration: 3000,
        isClosable: true,
      });
    }
  }, [multipleWRAcceptSuccess, onMultiQRClose, multipleWRAcceptError, toast]);

  useEffect(() => {
    async function fetchPendingTransactionData() {
      try {
        const response = await axios.get(
          `https://api.helium.io/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/pending_transactions`
        );
        if (response) {
          setPendingTransaction(response?.data?.data);
          setPendingLoading(false);
        } else {
          throw new Error('Api Failed!');
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (refresh || !refresh) {
      fetchPendingTransactionData();
    }
    return () => {};
  }, [refresh]);

  const rejectHandler = () => {
    dispatch(rejectWithdrawRequest(wrId));
  };
  const acceptHandler = () => {
    dispatch(acceptWithdrawRequest(wrId));
  };

  const onMultipleWithdrawRequestAcceptClick = (requestIds) => {
    console.log({ requestIds });
    dispatch(acceptMultipleWithdrawRequests(requestIds));
  };

  return (
    <Box p={{ md: 4 }}>
      <Helmet>
        <title>Withdrawal Request | Admin Dashboard</title>
      </Helmet>
      <Flex justifyContent='space-between'>
        <Text
          fontSize={{ base: 'md', md: '2xl' }}
          display='inline-block'
          className='adminPageHeader'
        >
          Withdrawal Requests ({wRequests ? wRequests?.length : '0'})
        </Text>
        <Button onClick={() => onMultiQROpen()}>Multi QR Code</Button>
      </Flex>
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
                <Box d={{ md: 'flex' }} mt='2'>
                  <Text fontStyle='italic' fontSize='xs'>
                    <i className='far fa-clock '></i>{' '}
                    {moment(data?.createdAt).format('LLL')}
                  </Text>
                  <Text color='blue.500' ml='3' fontSize='xs'>
                    <i
                      className='fas fa-money-check-alt'
                      style={{ marginRight: 5 }}
                    ></i>
                    {data?.client?.wallet_address}
                  </Text>
                  <Button
                    ml='2'
                    variant='outline'
                    size='xs'
                    onClick={() => {
                      setQRCode(data?.w_qr_code);
                      onQROpen();
                    }}
                  >
                    QR
                  </Button>
                </Box>
              </Box>
              <Spacer />
              <Box d={{ md: 'flex' }} textAlign='right' alignItems='center'>
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

                <Box f={{ sm: 'flex' }}>
                  <Button
                    size='sm'
                    colorScheme='teal'
                    variant='outline'
                    borderColor='teal'
                    mr={2}
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
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <AlertMessage
            status='warning'
            error='No withdrawal requests available!'
          />
        )}
        <Box mt='3'>
          <Box d={{ md: 'flex' }}>
            <Text borderBottom='1px' borderColor='gray.400' pb='1'>
              Transaction Activity (
              {pendingTransactions ? pendingTransactions?.length : '0'}){' '}
            </Text>
            <Spacer />
            <Button
              colorScheme='green'
              leftIcon={<i className='fas fa-sync-alt'></i>}
              variant='outline'
              size='xs'
              onClick={() => setRefresh(!refresh)}
            >
              Refresh
            </Button>
          </Box>
          <Box p='2' className='assigned_hotspot_wrapper' mt='2'>
            {pendingTLoading ? (
              <Loader />
            ) : pendingTransactions?.length > 0 ? (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Type</Th>
                    <Th>Payee / Buyer</Th>
                    <Th>Amount (HNT)</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pendingTransactions?.map((data, idx) =>
                    data?.txn?.type === 'payment_v2' ? (
                      <Tr key={idx}>
                        <Td>
                          <a
                            target='_blank'
                            rel='noreferrer'
                            href={`https://explorer.helium.com/txns/${data?.hash}`}
                          >
                            Payment
                          </a>
                        </Td>
                        <Td>{data?.txn?.payments?.[0]?.payee}</Td>
                        <Td textAlign='center'>
                          {(
                            data?.txn?.payments?.[0]?.amount / 100000000
                          ).toFixed(2)}
                        </Td>
                        <Td>
                          <Badge
                            variant='outline'
                            colorScheme={
                              data?.status === 'cleared' ? 'green' : 'red'
                            }
                          >
                            {data?.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ) : (
                      <Tr key={idx}>
                        <Td>
                          <a
                            target='_blank'
                            rel='noreferrer'
                            href={`https://explorer.helium.com/txns/${data?.hash}`}
                          >
                            Hotspot Ownership Transfer
                          </a>
                        </Td>
                        <Td>
                          <p>
                            <span style={{ color: 'blueviolet' }}>To : </span>
                            {data?.txn?.buyer}
                          </p>
                          <p>
                            <span style={{ color: 'blueviolet' }}>From : </span>
                            {data?.txn?.seller}
                          </p>
                        </Td>
                        <Td textAlign='center'>-</Td>
                        <Td>
                          <Badge
                            variant='outline'
                            colorScheme={
                              data?.status === 'cleared' ? 'green' : 'red'
                            }
                          >
                            {data?.status}
                          </Badge>
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            ) : (
              <AlertMessage status='warning' error='No pending transaction!' />
            )}
          </Box>
        </Box>
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
        <Modal isOpen={isQROpen} onClose={onQRClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Wallet Address</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image margin='auto' src={qrCode} alt='QR Code' />
              {acceptLoading && <Loader />}
            </ModalBody>

            <ModalFooter>
              <Button variant='outline' colorScheme='blue' onClick={onQRClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isMultiQROpen} onClose={onMultiQRClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>All Wallet Address</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box w='100%' margin='0 auto'>
                <QRCode
                  value={JSON.stringify(withdrawRequests)}
                  size={256}
                  style={{ margin: '0 auto' }}
                  width='100%'
                />
              </Box>
              {acceptLoading && <Loader />}
            </ModalBody>

            <ModalFooter>
              <Flex>
                <Button
                  onClick={() => {
                    const requestIds = wRequests?.map((req) => req._id);
                    onMultipleWithdrawRequestAcceptClick(requestIds);
                  }}
                  mr='2'
                  colorScheme='whatsapp'
                  isLoading={multipleWRAcceptLoading}
                >
                  Accept All
                </Button>
                <Button
                  variant='outline'
                  colorScheme='blue'
                  onClick={onMultiQRClose}
                >
                  Close
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default WithdrawRequestScreen;
