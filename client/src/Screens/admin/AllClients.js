import React, { useEffect, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/layout';
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/table';
import {
  Spacer,
  Button,
  useToast,
  useColorMode,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllClients,
  getMWSWCWbalances,
  getRewardByAdmin,
} from '../../redux/action/AdminAction';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/Alert';
import { Helmet } from 'react-helmet';
import NumberFormat from 'react-number-format';
import { Bar as Barchart } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import { SearchIcon } from '@chakra-ui/icons';
import { Pagination } from '../../components/Pagination';

const AllClients = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [clientSearchText, setClientSearchText] = useState('');
  const [chartData, setChartData] = useState([]);
  const [thirtyDR, setThirtyDR] = useState('');
  const [sevenDR, setSevenDR] = useState('');
  const [lastDR, setLastDR] = useState('');
  const [chartInitial, setChartInitital] = useState({
    time: '30',
    bucket: 'day',
  });
  const [pageNo, setPageNo] = useState(1);

  const allClientsGet = useSelector((state) => state.allClientsGet);
  const { loading, clients, count: totalClientsCount, error } = allClientsGet;

  const MWSWCWget = useSelector((state) => state.MWSWCWget);
  const { loading: mwLoading, balances, error: mwError } = MWSWCWget;

  const [chartDataLoading, setChartDataLoading] = useState(false);

  const getRewardByA = useSelector((state) => state.getRewardByA);
  const {
    loading: rewardFLoading,
    success: rewardFSuccess,
    error: rewardFError,
  } = getRewardByA;

  useEffect(() => {
    if (rewardFSuccess) {
      toast({
        status: 'success',
        title: 'Success!',
        description: 'Clients reward fetched!',
        duration: 2000,
        isClosable: true,
      });
    }
    if (rewardFError) {
      toast({
        status: 'error',
        title: 'Failed!',
        description: rewardFError,
        duration: 2000,
        isClosable: true,
      });
    }
  }, [toast, rewardFSuccess, rewardFError]);

  useEffect(() => {
    if ((balances && Object.keys(balances)?.length < 1) || rewardFSuccess) {
      dispatch(getMWSWCWbalances());
    }
    dispatch(getAllClients(pageNo));
  }, [dispatch, balances, pageNo, rewardFSuccess]);

  useEffect(() => {
    const abortController = new AbortController();
    // fetching chart data
    async function fetchChartData() {
      try {
        setChartDataLoading(true);
        const response = await axios.get(
          `https://api.helium.io/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/rewards/sum?min_time=-${chartInitial?.time}%20day&bucket=${chartInitial?.bucket}
        `
        );
        if (response) {
          const result = response?.data?.data?.map((item) => {
            const total = item?.total;
            const date = moment(item?.timestamp).format('DD-MM-YYYY');
            return { total, date };
          });

          if (result?.length > 0) {
            setChartData(result?.reverse());
            setChartDataLoading(false);
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
    fetchChartData();

    return () => {
      abortController.abort();
    };
  }, [chartInitial?.time, chartInitial?.bucket]);

  useEffect(() => {
    const abortController = new AbortController();

    async function thsevenlastDayFetch() {
      const request30 = await axios.get(
        'https://api.helium.io/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/rewards/sum?min_time=-30%20day'
      );
      const request7 = await axios.get(
        'https://api.helium.io/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/rewards/sum?min_time=-7%20day'
      );
      const request1 = await axios.get(
        'https://api.helium.io/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/rewards/sum?min_time=-1%20day'
      );
      try {
        const responses = await axios.all([request30, request7, request1]);
        if (responses) {
          const res30 = responses[0]?.data?.data?.total;
          const res7 = responses[1]?.data?.data?.total;
          const res1 = responses[2]?.data?.data?.total;
          setThirtyDR(res30);
          setSevenDR(res7);
          setLastDR(res1);
        } else {
          throw new Error('Failed to fetch APIs Data!');
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (thirtyDR === '' || sevenDR === '' || lastDR === '') {
      thsevenlastDayFetch();
    }
    return () => {
      abortController.abort();
    };
  }, [thirtyDR, sevenDR, lastDR]);

  const onFetchRewardButtonClick = () => {
    if (clients && clients.length > 0) {
      const clientIds = clients.map((client) => client.client_id._id);
      dispatch(getRewardByAdmin(clientIds));
    }
  };

  const clientsList = clients?.filter((client) => {
    return clientSearchText !== ''
      ? client?.client_id?.firstname
          .toLowerCase()
          .includes(clientSearchText.toLowerCase()) ||
          client?.client_id?.lastname
            .toLowerCase()
            .includes(clientSearchText.toLowerCase()) ||
          client?.client_id?.username
            .toLowerCase()
            .includes(clientSearchText.toLowerCase()) ||
          client?.client_id?.phone_number
            .toLowerCase()
            .includes(clientSearchText.toLowerCase()) ||
          client?.client_id?.wallet_address
            .toLowerCase()
            .includes(clientSearchText.toLowerCase()) ||
          client?.client_id?.email
            .toLowerCase()
            .includes(clientSearchText.toLowerCase())
      : client;
  });

  return (
    <Box p='4'>
      <Helmet>
        <title>All Clients | Admin Dashboard</title>
      </Helmet>
      <Box d={{ md: 'flex' }} color='white' mt='3'>
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='#ceae40'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
        >
          <Heading size='md'>Main Wallet Balance</Heading>
          <Box style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {mwLoading ? (
              <Loader small />
            ) : (
              <NumberFormat
                prefix='HNT '
                displayType='text'
                value={balances ? balances?.mw_balance?.toFixed(2) : '0'}
                thousandSeparator={true}
              />
            )}
          </Box>
        </Box>
        <Spacer />
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='#43456d'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
        >
          <Heading size='md'>Clients Balance</Heading>
          <Box style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {mwLoading ? (
              <Loader small />
            ) : (
              <NumberFormat
                prefix='HNT '
                displayType='text'
                value={balances ? balances?.cw_balance?.toFixed(2) : '0'}
                thousandSeparator={true}
              />
            )}
          </Box>
        </Box>
        <Spacer />
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='#00224e'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
        >
          <Heading size='md'>Available Balance</Heading>
          <Box style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {mwLoading ? (
              <Loader small />
            ) : (
              <NumberFormat
                prefix='HNT '
                displayType='text'
                value={
                  balances
                    ? (
                        parseFloat(balances?.mw_balance) -
                        parseFloat(balances?.cw_balance)
                      ).toFixed(2)
                    : '0'
                }
                thousandSeparator={true}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box d={{ md: 'flex' }} color='white' mt='3'>
        <Box
          boxShadow='base'
          textAlign='center'
          p='2'
          borderRadius='lg'
          border='1px'
          borderColor='#ceae40'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
          color={colorMode === 'light' ? 'gray.600' : '#ddd'}
        >
          <Heading size='sm'>Last 30 Days Rewards</Heading>
          <Box style={{ fontWeight: 'bold' }} fontSize='lg'>
            <NumberFormat
              prefix='HNT '
              displayType='text'
              value={thirtyDR ? thirtyDR.toFixed(2) : '0'}
              thousandSeparator={true}
            />
          </Box>
        </Box>
        <Spacer />
        <Box
          boxShadow='base'
          textAlign='center'
          p='2'
          borderRadius='lg'
          border='1px'
          borderColor='#43456d'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
          color={colorMode === 'light' ? 'gray.600' : '#ddd'}
        >
          <Heading size='sm'>Last 7 Days Rewards</Heading>
          <Box style={{ fontWeight: 'bold' }} fontSize='lg'>
            <NumberFormat
              prefix='HNT '
              displayType='text'
              value={sevenDR ? sevenDR?.toFixed(2) : '0'}
              thousandSeparator={true}
            />
          </Box>
        </Box>
        <Spacer />
        <Box
          boxShadow='base'
          textAlign='center'
          p='2'
          borderRadius='lg'
          border='1px'
          borderColor='#00224e'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
          color={colorMode === 'light' ? 'gray.600' : '#ddd'}
        >
          <Heading size='sm'>Last 24 Hours Rewards</Heading>
          <Box style={{ fontWeight: 'bold' }} fontSize='lg'>
            <NumberFormat
              prefix='HNT '
              displayType='text'
              value={lastDR ? lastDR?.toFixed(2) : '0'}
              thousandSeparator={true}
            />
          </Box>
        </Box>
      </Box>
      {mwError && <AlertMessage status='error' error={mwError} />}
      <Box boxShadow='md' p='3' borderRadius='md'>
        <Box d={{ md: 'flex' }}>
          <Text fontWeight='semibold' fontSize='lg'>
            {chartInitial?.time === '60'
              ? 'Rewards per Week'
              : 'Last 30 Days Reward'}
          </Text>
          <Spacer />
          <Button
            size='sm'
            w={{ base: '100%', md: 'auto' }}
            variant='outline'
            colorScheme='green'
            leftIcon={<i className='fas fa-sync-alt'></i>}
            onClick={() => {
              setChartInitital((state) => ({
                time: state?.time === '60' ? '30' : '60',
                bucket: state?.bucket === 'day' ? 'week' : 'day',
              }));
            }}
          >
            {chartInitial?.time === '30'
              ? 'Rewards per Week'
              : 'Last 30 Days Record'}
          </Button>
        </Box>
        <Box minH={560}>
          {chartDataLoading ? (
            <Box mt='5'>
              <Loader />
            </Box>
          ) : (
            <Barchart
              data={{
                labels: chartData?.map((data) => data?.date),
                datasets: [
                  {
                    label: 'Total Rewards',
                    data: chartData?.map((data) => data?.total.toFixed(2)),
                    backgroundColor: 'rgba(206,174,64, 0.2)',
                    borderColor: 'rgb(206,174,64)',
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
          )}
        </Box>
      </Box>
      <Box display={{ sm: 'flex' }} mt='3' mb='3' alignItems='center'>
        <Text fontSize='2xl' className='adminPageHeader'>
          Clients
        </Text>
        <Spacer />
        <Box d={{ base: 'block', md: 'flex' }}>
          <InputGroup mr={{ md: 3 }} mb={{ base: 2, md: 0 }}>
            <InputLeftElement
              pointerEvents='none'
              children={<SearchIcon color='gray.300' />}
            />
            <Input
              variant='flushed'
              size='sm'
              type='text'
              placeholder='Search client ...'
              onChange={(e) => setClientSearchText(e.target.value)}
            />
          </InputGroup>

          <Link to={`/h/add-new-client`}>
            <Button
              className='button-third-color'
              variant='outline'
              w={{ base: '100%', md: 'auto' }}
              size='sm'
            >
              <i className='fas fa-user-plus' style={{ marginRight: 5 }}></i>{' '}
              Add New Client
            </Button>
          </Link>
        </Box>
      </Box>
      <Box className='assigned_hotspot_wrapper'>
        {loading ? (
          <Loader />
        ) : error ? (
          <AlertMessage status='error' error={error} />
        ) : clients && clients?.length > 0 ? (
          <Table shadow='lg' size='sm' variant='striped'>
            <TableCaption>All Clients with their Wallet Balance.</TableCaption>
            <Thead>
              <Tr>
                <Th>Client Name</Th>
                <Th isNumeric>Wallet Balance</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clientsList
                .sort((a, b) =>
                  a?.client_id?.firstname > b?.client_id?.firstname ? 1 : -1
                )
                .map((client) => (
                  <Tr key={client?._id}>
                    <Td>
                      <Link to={`/h/client/${client?.client_id?._id}`}>
                        {client?.client_id?.firstname +
                          ' ' +
                          client?.client_id?.lastname}
                      </Link>
                    </Td>
                    <Td isNumeric>
                      <Text
                        fontWeight='semibold'
                        color={colorMode === 'light' ? 'gray.600' : 'green.500'}
                      >
                        <NumberFormat
                          prefix='HNT '
                          thousandSeparator={true}
                          displayType='text'
                          value={client?.wallet_balance.toFixed(2)}
                        />
                      </Text>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        ) : (
          <AlertMessage status='error' error='No clients found!' />
        )}
      </Box>

      <Box
        mt='10'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Button
          w={{ base: '100%', md: 'auto' }}
          mr={{ md: 2 }}
          mt={{ base: 2, md: 0 }}
          colorScheme='purple'
          variant='outline'
          disabled={loading || !clients?.length}
          isLoading={rewardFLoading}
          loadingText='Fetching...'
          onClick={onFetchRewardButtonClick}
        >
          <i style={{ marginRight: 5 }} className='fas fa-download'></i>Fetch
          Reward
        </Button>

        <Pagination
          data={clients}
          pageNo={pageNo}
          setPageNo={setPageNo}
          dataLoading={loading}
          count={totalClientsCount}
          dataPerPage={100}
        />
      </Box>
    </Box>
  );
};

export default AllClients;
