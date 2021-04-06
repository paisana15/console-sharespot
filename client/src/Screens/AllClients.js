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
  FormControl,
  Input,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllClients,
  getMWSWCWbalances,
  getRewardByAdmin,
} from '../redux/action/AdminAction';
import Loader from '../components/Loader';
import AlertMessage from '../components/Alert';
import { Helmet } from 'react-helmet';
import NumberFormat from 'react-number-format';
import { Bar as Barchart } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';

const AllClients = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const allClientsGet = useSelector((state) => state.allClientsGet);
  const { loading, clients, error } = allClientsGet;
  const { colorMode } = useColorMode();
  const [clientSearchText, setClientSearchText] = useState('');
  const [chartData, setChartData] = useState([]);

  const MWSWCWget = useSelector((state) => state.MWSWCWget);
  const { loading: mwLoading, balances, error: mwError } = MWSWCWget;

  const getRewardByA = useSelector((state) => state.getRewardByA);
  const {
    loading: rewardFLoading,
    success: rewardFSuccess,
    error: rewardFError,
  } = getRewardByA;

  useEffect(() => {
    dispatch(getAllClients());
    dispatch(getMWSWCWbalances());

    if (rewardFSuccess) {
      toast({
        status: 'success',
        title: 'Success!',
        description: 'Clients reward fetched!',
        duration: 3000,
        isClosable: true,
      });
    }
    if (rewardFError) {
      toast({
        status: 'error',
        title: 'Failed!',
        description: rewardFError,
        duration: 3000,
        isClosable: true,
      });
    }
  }, [dispatch, toast, rewardFSuccess, rewardFError]);

  useEffect(() => {
    // fetching chart data
    async function fetchChartData() {
      try {
        const response = await axios.get(
          `https://api.helium.wtf/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/rewards/sum?min_time=-30%20day&bucket=day
        `
        );
        if (response) {
          const result = response?.data?.data?.map((item) => {
            const total = item?.total;
            const date = moment(item?.timestamp).format('YYYY-MM-DD');
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
    fetchChartData();
  }, []);

  const clientsList = clients?.filter((client) => {
    return clientSearchText !== ''
      ? client?.client_id?.firstname
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
          bg='red.400'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
        >
          <Heading size='md'>Main Wallet Balance</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
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
          <Heading size='md'>Clients Balance</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
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
          <Heading size='md'>Available Balance</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {mwLoading ? (
              <Loader small />
            ) : (
              <NumberFormat
                prefix='HNT '
                displayType='text'
                value={
                  balances
                    ? (
                        parseFloat(balances?.mw_balance) +
                        parseFloat(balances?.sw_balance) -
                        parseFloat(balances?.cw_balance)
                      ).toFixed(2)
                    : '0'
                }
                thousandSeparator={true}
              />
            )}
          </Text>
        </Box>
      </Box>
      {mwError && <AlertMessage status='error' error={mwError} />}
      <Box boxShadow='md' p='3' borderRadius='md'>
        <Text fontWeight='semibold' fontSize='lg'>
          Last 30 Days Reward
        </Text>
        <Box>
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
          />
        </Box>
      </Box>
      <Box display={{ sm: 'flex' }} mt='3' mb='3' alignItems='center'>
        <Text fontSize='2xl' className='adminPageHeader'>
          All Clients ({clients ? clients?.length : '0'})
        </Text>
        <Spacer />
        <Box d={{ base: 'block', md: 'flex' }}>
          <FormControl mr={{ md: 3 }} mb={{ base: 2, md: 0 }}>
            <Input
              variant='flushed'
              size='sm'
              placeholder='Search client ...'
              onChange={(e) => setClientSearchText(e.target.value)}
            />
          </FormControl>
          <Link to={`/h/add-new-client`}>
            <Button
              variant='outline'
              w={{ base: '100%', md: 'auto' }}
              size='sm'
              colorScheme='purple'
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
      <Box mt='2'>
        <Button
          w={{ base: '100%', md: 'auto' }}
          mr={{ md: 2 }}
          mt={{ base: 2, md: 0 }}
          colorScheme='orange'
          variant='outline'
          isLoading={rewardFLoading}
          loadingText='Fetching...'
          onClick={() => {
            dispatch(getRewardByAdmin());
          }}
        >
          <i style={{ marginRight: 5 }} className='fas fa-download'></i>Fetch
          Reward
        </Button>
      </Box>
    </Box>
  );
};

export default AllClients;
