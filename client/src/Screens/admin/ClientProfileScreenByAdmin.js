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
  IconButton,
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
import AlertMessage from '../../components/Alert';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteHotspot,
  deleteClient,
  getManulaWithdrawHistory,
  addManulaWithdrawHistory,
  deleteManulaWithdrawHistory,
  getWithdrawHistoryByA,
} from '../../redux/action/AdminAction';
import Loader from '../../components/Loader';
import moment from 'moment';
import MyTextField from '../../components/MyTextField';
import { Formik } from 'formik';
import * as yup from 'yup';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import { Bar as Barchart } from 'react-chartjs-2';

const ClientProfileScreenByAdmin = ({ client_details }) => {
  const dispatch = useDispatch();
  const { url } = useRouteMatch();
  const { colorMode } = useColorMode();
  const [client, setClient] = useState({});
  const [client_hotspot, setClientHotspot] = useState([]);
  const [client_wallet, setClientWallet] = useState({});
  const [chartData, setChartData] = useState([]);
  const history = useHistory();
  const toast = useToast();
  const [hotspotAddress, setHotspotAddress] = useState('');
  const [hotspotPercent, setHotpotpercent] = useState(0);
  const [thirtDR, setThirtDR] = useState('');
  const [sevenDR, setSevenDR] = useState('');
  const [lastDR, setlastDR] = useState('');
  const [chartDaysLoading, setChartLoading] = useState(true);

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
  const { loading: addMWLoading, error: addMWError } = addMWHistory;

  const histtoryWBya = useSelector((state) => state.histtoryWBya);
  const {
    loading: historyLoading,
    wHistories,
    error: historyError,
  } = histtoryWBya;

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
    client_hotspot,
    success,
    dispatch,
    toast,
    history,
    client?._id,
    addMWError,
  ]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await axios.get(
          `https://api.helium.io/v1/hotspots/${hotspotAddress}/rewards/sum?min_time=-30%20day&bucket=day
        `
        );
        if (response) {
          const result = response?.data?.data?.map((item) => {
            const total = (item?.total * hotspotPercent) / 100;
            const date = moment(item?.timestamp).format('DD-MM-YYYY');
            return { total, date };
          });

          if (result?.length > 0) {
            setChartData(result?.reverse());
          } else {
            throw new Error();
          }
        } else {
          throw new Error('API Failed!');
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (hotspotAddress !== '') {
      fetchChartData();
    }
  }, [hotspotAddress, hotspotPercent]);

  const fieldValidationSchema = yup.object({
    m_withdraw: yup.number().required('Amount Required!'),
  });

  const clientDelteHandler = () => {
    dispatch(deleteClient(client?._id));
  };

  const getClientWHHandler = () => {
    onWHOpen();
    dispatch(getWithdrawHistoryByA(client?._id));
  };

  const selectHandler = async (address, percentage) => {
    setHotspotAddress(address);
    setHotpotpercent(percentage);
    try {
      setChartLoading(true);
      // 30 days reward
      const request1 = await axios.get(
        `https://api.helium.io/v1/hotspots/${address}/rewards/sum?min_time=-30%20day`
      );
      // 7 days reward
      const request2 = await axios.get(
        `https://api.helium.io/v1/hotspots/${address}/rewards/sum?min_time=-7%20day`
      );
      // 24 hours reward
      const request3 = await axios.get(
        `https://api.helium.io/v1/hotspots/${address}/rewards/sum?min_time=-1%20day`
      );
      const responses = await axios.all([request1, request2, request3]);

      if (responses) {
        const res1 = responses[0]?.data?.data?.total;
        const res2 = responses[1]?.data?.data?.total;
        const res3 = responses[2]?.data?.data?.total;

        setThirtDR((res1 * percentage) / 100);
        setSevenDR((res2 * percentage) / 100);
        setlastDR((res3 * percentage) / 100);
        setChartLoading(false);
      } else {
        throw new Error('Failed to fetch APIs Data!');
      }
    } catch (error) {
      throw new Error(error);
    }
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
            <i className='fas fa-user'></i>
            <span style={{ padding: '0 4px' }} />
            Username : {client?.username}
          </Text>
          <Spacer />
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-at'></i>
            <span style={{ padding: '0 4px' }} />
            Email : {client?.email}
          </Text>
        </Box>
        <Box display={{ md: 'flex' }}>
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-phone-alt'></i>
            <span style={{ padding: '0 4px' }} />
            Phone : {client?.phone_number}
          </Text>
          <Spacer />
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-wallet'></i>
            <span style={{ padding: '0 4px' }} />
            Wallet Address : {client?.wallet_address}
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
            <NumberFormat
              prefix='HNT '
              displayType='text'
              value={
                client_wallet ? client_wallet?.totalWithdraw?.toFixed(2) : '0'
              }
              thousandSeparator={true}
            />
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
            <NumberFormat
              prefix='HNT '
              displayType='text'
              value={
                client_wallet ? client_wallet?.totalRewards?.toFixed(2) : '0'
              }
              thousandSeparator={true}
            />
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
            <NumberFormat
              prefix='HNT '
              displayType='text'
              value={
                client_wallet ? client_wallet?.wallet_balance?.toFixed(2) : '0'
              }
              thousandSeparator={true}
            />
          </Text>
        </Box>
      </Box>
      <Box>
        <Box boxShadow='md' borderRadius='md' p='3'>
          {chartData?.length > 0 ? (
            <Box p='3'>
              <Text fontSize='lg' fontWeight='semibold'>
                Daily Reward
              </Text>
              <Barchart
                data={{
                  labels: chartData?.map((data) => data?.date),
                  datasets: [
                    {
                      label: 'Total Rewards',
                      data: chartData?.map((data) => data?.total.toFixed(2)),
                      backgroundColor: 'rgba(153, 102, 255, 0.2)',
                      borderColor: 'rgb(153, 102, 255)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                }}
              />
              <Box pb='2' d={{ md: 'flex' }} mt='3'>
                <Badge variant='outline' colorScheme='green'>
                  Last 30 Days Reward : HNT{' '}
                  {chartDaysLoading ? (
                    <Loader xs />
                  ) : (
                    thirtDR && thirtDR.toFixed(2)
                  )}
                </Badge>
                <Spacer />
                <Badge variant='outline' colorScheme='blue'>
                  Last 7 Days Reward : HNT{' '}
                  {chartDaysLoading ? (
                    <Loader xs />
                  ) : (
                    sevenDR && sevenDR.toFixed(2)
                  )}
                </Badge>
                <Spacer />

                <Badge variant='outline' colorScheme='orange'>
                  Last 24 Hours Reward : HNT{' '}
                  {chartDaysLoading ? (
                    <Loader xs />
                  ) : (
                    lastDR && lastDR.toFixed(2)
                  )}
                </Badge>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
      <Box mt='4'>
        <Heading mb='3' pl='3' size='xs'>
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
                <Box d={{ md: 'flex' }}>
                  <Box>
                    <IconButton
                      mr={{ md: 2 }}
                      color='blue.400'
                      aria-label='Search database'
                      icon={<i className='far fa-chart-bar'></i>}
                      onClick={() =>
                        selectHandler(
                          hotspot?.hotspot_address,
                          hotspot?.percentage
                        )
                      }
                    />
                  </Box>
                  <Box>
                    <Heading size='sm'>
                      <a
                        target='_blank'
                        rel='noreferrer'
                        href={`https://explorer.helium.com/hotspots/${hotspot?.hotspot_address}`}
                      >
                        {hotspot?.hotspot_name}
                      </a>
                    </Heading>
                    <Box d={{ sm: 'flex' }} mt='2'>
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
                      <Text fontSize='xs' ml='2' mr='1'>
                        From
                      </Text>
                      <Badge colorScheme='blue'>
                        <Text fontSize='xs'>
                          {moment(hotspot?.startDate).format('DD-MM-YYYY')}
                        </Text>
                      </Badge>
                      <Text fontSize='xs' ml='2' mr='1'>
                        To
                      </Text>
                      <Badge colorScheme='blue'>
                        <Text fontSize='xs'>
                          {moment(hotspot?.endDate).format('DD-MM-YYYY')}
                        </Text>
                      </Badge>
                    </Box>
                  </Box>
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
                      fontWeight='semibold'
                      color={colorMode === 'light' ? 'grey' : 'orange.200'}
                      fontSize='sm'
                    >
                      <NumberFormat
                        prefix='HNT '
                        displayType='text'
                        value={hotspot?.total_earned.toFixed(2)}
                        thousandSeparator={true}
                      />
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
        ) : (
          error && <AlertMessage status='error' error={error} />
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
              <Button
                mr='2'
                variant='outline'
                colorScheme='blue'
                onClick={onClose}
              >
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
                            variant={
                              colorMode === 'light' ? 'solid' : 'outline'
                            }
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
                    resetForm();
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
                          size='sm'
                        >
                          Close
                        </Button>
                        <Button
                          mt='2'
                          isLoading={addMWLoading}
                          loadingText={'Adding...'}
                          type='submit'
                          colorScheme='facebook'
                          size='sm'
                        >
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
                  <Tbody>
                    {mw_histories?.length > 0 &&
                      mw_histories?.map((data) => (
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
                      ))}
                  </Tbody>
                </Table>
                {mw_histories?.length < 1 && (
                  <AlertMessage
                    status='error'
                    error='No history for this user!'
                  />
                )}
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default ClientProfileScreenByAdmin;
