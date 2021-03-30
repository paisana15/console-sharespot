import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Heading,
  Spacer,
  Badge,
  Tooltip,
  useColorMode,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  TableCaption,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useHistory, useRouteMatch } from 'react-router';
import AlertMessage from '../components/Alert';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteHotspot,
  deleteClient,
  getRewardByAdmin,
  getManulaWithdrawHistory,
  addManulaWithdrawHistory,
  deleteManulaWithdrawHistory,
  getWithdrawHistoryByA,
} from '../redux/action/AdminAction';
import Loader from '../components/Loader';
import moment from 'moment';
import MyTextField from '../components/MyTextField';
import { Formik } from 'formik';
import * as yup from 'yup';

const ClientProfileScreenByAdmin = ({ client_details }) => {
  const { url } = useRouteMatch();
  const { colorMode } = useColorMode();
  const [client, setClient] = useState({});
  const [client_hotspot, setClientHotspot] = useState([]);
  const [client_wallet, setClientWallet] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();
  const toast = useToast();

  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onWOpen,
    isOpen: isWOpen,
    onClose: onWClose,
  } = useDisclosure();
  const {
    onOpen: onWHOpen,
    isOpen: isWHOpen,
    onClose: onWHClose,
  } = useDisclosure();

  const singleClientDel = useSelector((state) => state.singleClientDel);
  const { loading, success, error } = singleClientDel;

  const getMWHistories = useSelector((state) => state.getMWHistories);
  const { mw_histories } = getMWHistories;

  const addMWHistory = useSelector((state) => state.addMWHistory);
  const { error: addMWError } = addMWHistory;

  const histtoryWBya = useSelector((state) => state.histtoryWBya);
  const {
    loading: historyLoading,
    wHistories,
    error: historyError,
  } = histtoryWBya;

  const fetchReward = useSelector((state) => state.fetchReward);
  const {
    loading: rewardLoading,
    success: rewardSuccess,
    error: rewardError,
  } = fetchReward;

  useEffect(() => {
    setClient(client_details?.client);
    setClientHotspot(client_details?.client_hotspot);
    setClientWallet(client_details?.clientWallet);
    if (success) {
      history.push('/h/clients');
    }
    if (client?._id) {
      dispatch(getManulaWithdrawHistory(client?._id));
    }
    if (addMWError) {
      toast({
        title: 'Failed!',
        status: 'error',
        description: addMWError,
        duration: 3000,
        isClosable: true,
      });
    }
  }, [
    client_details,
    success,
    dispatch,
    rewardSuccess,
    toast,
    history,
    client?._id,
    addMWError,
  ]);

  const fieldValidationSchema = yup.object({
    m_withdraw: yup
      .number()
      .min(1, 'Min withdraw 1 HNT!')
      .required('Amount Required!'),
  });

  const clientDelteHandler = () => {
    dispatch(deleteClient(client?._id));
  };
  const fetchRewardHandler = () => {
    dispatch(getRewardByAdmin(client?._id));
  };
  const getClientWHHandler = () => {
    onWHOpen();
    dispatch(getWithdrawHistoryByA(client?._id));
  };

  return (
    <>
      <Box>
        <Flex alignItems='center'>
          <Heading
            textColor={`${colorMode === 'light' ? 'gray.600' : '#b3bfd4'}`}
            size='lg'
            mb='1'
          >
            {client?.firstname + ' ' + client?.lastname}
          </Heading>
          <Tooltip hasArrow label='Edit Profile' bg='gray.300' color='black'>
            <span
              style={{ color: '#8594af', marginLeft: 5, cursor: 'pointer' }}
            >
              <Link to={`${url}/edit`}>
                <i className='fas fa-edit'></i>
              </Link>
            </span>
          </Tooltip>
        </Flex>
        <Box display={{ md: 'flex' }}>
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-user'></i> Username : {client?.username}
          </Text>
          <Spacer />
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-at'></i> Email : {client?.email}
          </Text>
        </Box>
        <Box display={{ md: 'flex' }}>
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-phone-alt'></i> Phone : {client?.phone_number}
          </Text>
          <Spacer />
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-wallet'></i> Wallet Address :{' '}
            {client?.wallet_address}
          </Text>
        </Box>
      </Box>
      <Box d={{ md: 'flex' }} color='white' mt='3'>
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='red.400'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
        >
          <Heading size='md'>Total Withdrawn</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {rewardLoading ? (
              <Loader small />
            ) : (
              `HNT ${
                client_wallet ? client_wallet?.totalWithdraw?.toFixed(2) : '0'
              }`
            )}
          </Text>
        </Box>
        <Spacer />
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='green.400'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
        >
          <Heading size='md'>Total Rewards</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {rewardLoading ? (
              <Loader small />
            ) : (
              `HNT ${
                client_wallet ? client_wallet?.totalRewards?.toFixed(2) : '0'
              }`
            )}
          </Text>
        </Box>
        <Spacer />
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='blue.400'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
        >
          <Heading size='md'>Balance</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {rewardLoading ? (
              <Loader small />
            ) : (
              `HNT ${
                client_wallet ? client_wallet?.wallet_balance?.toFixed(2) : '0'
              }`
            )}
          </Text>
        </Box>
      </Box>
      <Box mt='4'>
        <Heading mb='3' size='xs'>
          Assigned Hotspot ({client?.total_hotspot})
        </Heading>
        <Box
          boxShadow='md'
          borderRadius='md'
          p='4'
          className='assigned_hotspot_wrapper'
        >
          {client_hotspot?.length > 0 ? (
            client_hotspot.map((hotspot) => (
              <Box
                display={{ md: 'flex' }}
                key={hotspot?._id}
                p='4'
                borderRadius='lg'
                mb='3'
                boxShadow='base'
                bg={colorMode === 'light' ? '#f4f5f7' : '#303744'}
              >
                <Box>
                  <Heading size='sm'>{hotspot?.hotspot_name}</Heading>
                  <Flex mt='2'>
                    <Text fontSize='xs' mr='1'>
                      Percentage
                    </Text>
                    <Badge colorScheme={'green'}>
                      <Text fontSize='xs'>{hotspot?.percentage + '%'}</Text>
                    </Badge>
                    <Badge
                      ml='10px'
                      colorScheme={
                        hotspot?.relation_type === 'host'
                          ? 'purple'
                          : hotspot?.relation_type === 'referrer'
                          ? 'red'
                          : 'pink'
                      }
                    >
                      <Text fontSize='xs'>{hotspot?.relation_type}</Text>
                    </Badge>
                    <Text
                      display={{ base: 'block', md: 'inline-block' }}
                      fontSize='xs'
                      ml='2'
                      mr='1'
                    >
                      From
                    </Text>
                    <Badge colorScheme='blue'>
                      <Text fontSize='xs'>
                        {moment(hotspot?.startDate).format('YYYY-MM-DD')}
                      </Text>
                    </Badge>
                  </Flex>
                </Box>
                <Spacer display={{ base: 'none', md: 'block' }} />
                <Flex
                  mt={{ base: '3', md: '0' }}
                  textAlign='right'
                  alignItems='center'
                >
                  <Box mr='2'>
                    <Text fontSize='sm' color='grey'>
                      Total Earned
                    </Text>
                    <Text
                      fontWeight='bold'
                      color={colorMode === 'light' ? 'grey' : 'orange.200'}
                      fontSize='sm'
                    >
                      HNT {hotspot?.total_earned.toFixed(2)}
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
                      onClick={() =>
                        history.push(`${url}/hotspot/${hotspot?._id}/edit`)
                      }
                    >
                      <EditIcon color='teal.300' />
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      colorScheme='red'
                      borderColor='red.400'
                      color='gray.500'
                      onClick={() => {
                        dispatch(deleteHotspot(hotspot?._id, client?._id));
                      }}
                    >
                      <DeleteIcon color='red.300' />
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            ))
          ) : (
            <AlertMessage status='error' error='No hotspot assigned yet!' />
          )}
        </Box>
        <Box d={{ md: 'flex' }} mt='6' alignItems='center'>
          <Button
            mr={{ md: 2 }}
            w={{ base: '100%', md: 'auto' }}
            mt={{ base: 2, md: 0 }}
            variant='solid'
            colorScheme='red'
            onClick={onOpen}
          >
            <i style={{ marginRight: 5 }} className='far fa-trash-alt'></i>
            Delete Client
          </Button>
          <Button
            w={{ base: '100%', md: 'auto' }}
            mr={{ md: 2 }}
            mt={{ base: 2, md: 0 }}
            onClick={fetchRewardHandler}
            colorScheme='orange'
            variant='outline'
          >
            <i style={{ marginRight: 5 }} className='fas fa-download'></i>Fetch
            Reward
          </Button>
          <Button
            w={{ base: '100%', md: 'auto' }}
            mr={{ md: 2 }}
            mt={{ base: 2, md: 0 }}
            colorScheme='yellow'
            variant='outline'
            onClick={onWOpen}
          >
            <i style={{ marginRight: 5 }} className='fas fa-money-check'></i>Add
            Withdraw
          </Button>
          <Button
            w={{ base: '100%', md: 'auto' }}
            mr={{ md: 2 }}
            mt={{ base: 2, md: 0 }}
            colorScheme='purple'
            variant='outline'
            onClick={getClientWHHandler}
          >
            <i style={{ marginRight: 5 }} className='fas fa-money-check'></i>
            Withdraw History
          </Button>
        </Box>

        {loading ? (
          <Loader />
        ) : error ? (
          <AlertMessage status='error' error={error} />
        ) : (
          rewardError && <AlertMessage status='error' error={rewardError} />
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{'Are you sure you want to remove this client?'}</Text>
            </ModalBody>

            <ModalFooter>
              <Button variant='outline' colorScheme='blue' onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={clientDelteHandler}
                colorScheme='red'
                variant='outline'
              >
                Yes, Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isWHOpen} onClose={onWHClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Withdraw History</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                {historyLoading ? (
                  <Loader />
                ) : historyError ? (
                  <AlertMessage status='error' error={historyError} />
                ) : wHistories && wHistories?.length > 0 ? (
                  wHistories.map((data) => (
                    <Flex
                      key={data?._id}
                      p='4'
                      borderRadius='lg'
                      mb='3'
                      boxShadow='base'
                      bg={colorMode === 'light' ? '#f4f5f7' : '#303744'}
                    >
                      <Box>
                        <Heading size='sm'>
                          {moment(data?.createdAt).format('LLL')}
                        </Heading>
                      </Box>
                      <Spacer />
                      <Flex textAlign='right' alignItems='center'>
                        <Box mr='2'>
                          <Text fontSize='sm' color='grey'>
                            Amount
                          </Text>
                          <Text
                            fontWeight='bold'
                            color={
                              colorMode === 'light' ? 'grey' : 'orange.200'
                            }
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
            </ModalBody>

            <ModalFooter>
              <Button
                variant='outline'
                colorScheme='blue'
                mr={3}
                onClick={onWHClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isWOpen} onClose={onWClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Manual Withdraw</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <Formik
                  initialValues={{
                    m_withdraw: '',
                  }}
                  validationSchema={fieldValidationSchema}
                  onSubmit={(data, { resetForm }) => {
                    dispatch(
                      addManulaWithdrawHistory(client?._id, data?.m_withdraw)
                    );
                    if (success) {
                      resetForm();
                    }
                  }}
                >
                  {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <MyTextField
                        type='text'
                        placeholder='Manual withdraw amount'
                        label='Amount'
                        name='m_withdraw'
                      />
                      <Box d='flex' alignItems='baseline' float='right'>
                        <Button
                          variant='outline'
                          colorScheme='blue'
                          onClick={onWClose}
                          mr='2'
                        >
                          Close
                        </Button>
                        <Button mt='2' type='submit' colorScheme='facebook'>
                          Add
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
              </Box>
              <Box>
                <Table mt='24' shadow='lg' size='sm' variant='striped'>
                  <TableCaption>Recent withdraw added by admin</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th isNumeric>Amount</Th>
                    </Tr>
                  </Thead>
                  {mw_histories?.length > 0 ? (
                    mw_histories?.map((data) => (
                      <Tbody>
                        <Tr key={data?._id}>
                          <Td>{moment(data?.createdAt).format('LLL')}</Td>
                          <Td textColor='green.400' isNumeric>
                            HNT {data?.mw_amount}
                          </Td>
                          <Td isNumeric>
                            <Button
                              variant='outline'
                              colorScheme='red'
                              size='xs'
                              onClick={() => {
                                dispatch(
                                  deleteManulaWithdrawHistory(data?._id)
                                );
                              }}
                            >
                              <DeleteIcon />
                            </Button>
                          </Td>
                        </Tr>
                      </Tbody>
                    ))
                  ) : (
                    <AlertMessage
                      status='error'
                      error='No history for this user!'
                    />
                  )}
                </Table>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default ClientProfileScreenByAdmin;
