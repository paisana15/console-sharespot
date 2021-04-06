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
  FormControl,
  Select,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useHistory, useRouteMatch } from 'react-router';
import AlertMessage from '../components/Alert';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import { Bar as Barchart } from 'react-chartjs-2';

const ClientProfileScreen = ({ client_details }) => {
  const { url } = useRouteMatch();
  const { colorMode } = useColorMode();
  const [client, setClient] = useState({});
  const [client_hotspot, setClientHotspot] = useState([]);
  const [client_wallet, setClientWallet] = useState({});
  const history = useHistory();
  const [chartData, setChartData] = useState([]);
  const [hotspotAddress, setHotspotAddress] = useState('');
  const [hotspotPercent, setHotpotpercent] = useState('');

  useEffect(() => {
    setClient(client_details?.client);
    setClientHotspot(client_details?.client_hotspot);
    setClientWallet(client_details?.clientWallet);
  }, [client_details, history]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await axios.get(
          `https://api.helium.wtf/v1/hotspots/${hotspotAddress}/rewards/sum?min_time=-30%20day&bucket=day
        `
        );
        if (response) {
          const result = response?.data?.data?.map((item) => {
            const total = (item?.total * hotspotPercent) / 100;
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
  }, [hotspotAddress, hotspotPercent]);

  const selectHandler = (value) => {
    setHotspotAddress(value);
    client_hotspot?.map(
      (data) =>
        data?.hotspot_address === value && setHotpotpercent(data?.percentage)
    );
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
            <NumberFormat
              prefix='HNT '
              thousandSeparator={true}
              displayType='text'
              value={
                client_wallet ? client_wallet?.totalWithdraw?.toFixed(2) : '0'
              }
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
              thousandSeparator={true}
              displayType='text'
              value={
                client_wallet ? client_wallet?.totalRewards?.toFixed(2) : '0'
              }
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
              thousandSeparator={true}
              displayType='text'
              value={
                client_wallet ? client_wallet?.wallet_balance?.toFixed(2) : '0'
              }
            />
          </Text>
        </Box>
      </Box>
      <Box>
        <Box boxShadow='md' borderRadius='md' p='3'>
          <Text fontSize='lg' fontWeight='semibold'>
            Daily Reward
          </Text>
          <Box>
            <FormControl>
              <Select
                value={hotspotAddress}
                onChange={(e) => selectHandler(e.target.value)}
                variant='flushed'
                placeholder='Select hotspot'
              >
                {client_hotspot.map((data) => (
                  <option value={data?.hotspot_address}>
                    {data?.hotspot_name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Box>
          {chartData?.length > 0 ? (
            <>
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
                  plugins: {
                    plugins: {
                      legend: {
                        display: false,
                        labels: {
                          color: 'rgb(255, 99, 132)',
                        },
                      },
                    },
                  },
                }}
              />
            </>
          ) : null}
        </Box>
      </Box>
      <Box mt='4'>
        <Heading size='xs'>Assigned Hotspot ({client?.total_hotspot})</Heading>
        <Box
          boxShadow='md'
          borderRadius='md'
          p='5'
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
                        {moment(hotspot?.startDate).format('YYYY-MM-DD')}
                      </Text>
                    </Badge>
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
                        thousandSeparator={true}
                        displayType='text'
                        value={hotspot?.total_earned.toFixed(2)}
                      />
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))
          ) : (
            <AlertMessage status='error' error='No hotspot assigned yet!' />
          )}
        </Box>
      </Box>
    </>
  );
};

export default ClientProfileScreen;
