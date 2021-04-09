import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Heading,
  Spacer,
  Badge,
  useColorMode,
  IconButton,
  Button
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import AlertMessage from '../components/Alert';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import { Bar as Barchart } from 'react-chartjs-2';
import Loader from '../components/Loader';

const ClientProfileScreen = ({ client_details }) => {
  const { colorMode } = useColorMode();
  const [client, setClient] = useState({});
  const [client_hotspot, setClientHotspot] = useState([]);
  const [client_wallet, setClientWallet] = useState({});
  const history = useHistory();
  const [chartData, setChartData] = useState([]);
  const [hotspotAddress, setHotspotAddress] = useState('');
  const [hotspotPercent, setHotpotpercent] = useState(0);
  const [thirtDR, setThirtDR] = useState('');
  const [sevenDR, setSevenDR] = useState('');
  const [lastDR, setlastDR] = useState('');
  const [chartDaysLoading, setChartLoading] = useState(true);

  useEffect(() => {
    setClient(client_details?.client);
    setClientHotspot(client_details?.client_hotspot);
    setClientWallet(client_details?.clientWallet);
  }, [client_details, history]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await axios.get(
          `https://api.helium.wtf/v1/hotspots/${hotspotAddress}/rewards/sum?min_time=-60%20day&bucket=week
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

  const selectHandler = async (address, percentage) => {
    setHotspotAddress(address);
    setHotpotpercent(percentage);
    try {
      setChartLoading(true);
      // 30 days reward
      const request1 = await axios.get(
        `https://api.helium.wtf/v1/hotspots/${address}/rewards/sum?min_time=-30%20day`
      );
      // 7 days reward
      const request2 = await axios.get(
        `https://api.helium.wtf/v1/hotspots/${address}/rewards/sum?min_time=-7%20day`
      );
      // 24 hours reward
      const request3 = await axios.get(
        `https://api.helium.wtf/v1/hotspots/${address}/rewards/sum?min_time=-1%20day`
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
            className='title-underline'
            textColor={`${colorMode === 'light' ? 'gray.600' : '#b3bfd4'}`}
            size='lg'
            mb='1'
          >
            {client?.firstname + ' ' + client?.lastname}
            <hr />
          </Heading>
        </Flex>
        <div className='d-flex flex-column d-md-flex flex-md-row justify-content-space-between'>
          <div className='d-flex flex-column mt-0 mt-md-4 w-50 mb-5'>
            <div className='d-flex align-items-baseline mb-3'>
              <span className='info-user-dashboard mr-2'>
                <i className='fas fa-user mr-1'></i>
                {client?.username}
              </span>
              <span className='info-user-dashboard mr-2'>
                <i className='fas fa-phone-alt mr-1'></i>
                {client?.phone_number}
              </span>
              <span className='info-user-dashboard'>
                <i className='fas fa-at mr-1'></i>
                {client?.email}
              </span>
            </div>
            <span className='d-flex info-user-dashboard word-break align-items-center'>
              <i className='fas fa-wallet'></i>
              {client?.wallet_address}
            </span>
          </div>
          <div className='d-flex w-50 container-total '>
            <div className='d-flex flex-column justify-content-around'>
              <div className='d-flex align-items-center'>
                <h5 className='total-text'>Total Rewards</h5>
                <div className='total-rewards'>
                  <Text style={{ fontWeight: 'bold' }} fontSize='lg'>
                    <NumberFormat
                      suffix=' HNT'
                      thousandSeparator={true}
                      displayType='text'
                      value={
                        client_wallet
                          ? client_wallet?.totalRewards?.toFixed(2)
                          : '0'
                      }
                    />
                  </Text>
                </div>
              </div>
              <div className='d-flex align-items-baseline'>
                <h5 className='total-text'>Total Withdrawn</h5>
                <div className='total-withdrawn'>
                  <Text style={{ fontWeight: 'bold' }} fontSize='lg'>
                    <NumberFormat
                      suffix=' HNT'
                      thousandSeparator={true}
                      displayType='text'
                      value={
                        client_wallet
                          ? client_wallet?.totalWithdraw?.toFixed(2)
                          : '0'
                      }
                    />
                  </Text>
                </div>
              </div>
            </div>
            <div className='d-flex flex-column available-container'>
            <div className='mx-auto'>
              <h5 className='total-text'>Available</h5>
              <Text style={{ fontWeight: 'bold' }} fontSize='2xl'>
                <NumberFormat
                  suffix=' HNT'
                  thousandSeparator={true}
                  displayType='text'
                  value={
                    client_wallet
                      ? client_wallet?.wallet_balance?.toFixed(2)
                      : '0'
                  }
                />
              </Text>
              </div>
            </div>
          </div>
        </div>
      </Box>
      <Box>
      <div className='button-wrapper'>
          <Link to={`/c/profile/withdraw`}>
            <Button
              className='button-dashboard bg-blue'
              w={{ base: '100%'}}
              mr={{ md: 2 }}
              mt={{ base: 2, md: 0 }}
              // onClick={getRewardHandler}
              variant={colorMode === 'dark' ? 'outline' : 'solid'}
            >
              <div className='d-flex'>
                <i style={{ marginRight: 5 }} className='fas fa-download'></i>
                <div className='d-flex flex-column'>
                  <span>
                    Request
                  </span>
                  <span>
                    Withdraw
                  </span>
                </div>
              </div>
            </Button>
          </Link>
          {/* <Button
            className='button-dashboard bg-purple ml-3'
            w={{ base: '100%', md: 'auto' }}
            mr={{ md: 2 }}
            mt={{ base: 2, md: 0 }}
            // onClick={getRewardHandler}
            variant={colorMode === 'dark' ? 'outline' : 'solid'}
          >
            <div className='d-flex'>
              <i style={{ marginRight: 5 }} className='fas fa-redo'></i>
              <div className='d-flex flex-column'>
                <span>
                  Update
                </span>
                <span>
                  Rewards
                </span>
              </div>
            </div> 
          </Button> */}
        </div>
        <Box borderRadius='md'>
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
        <Heading size='xs'>Assigned Hotspot ({client?.total_hotspot})</Heading>
        <div className='d-flex justify-content-end mr-4'>Total Earned</div>
        <Box
          boxShadow='md'
          borderRadius='md'
          p='5'
          className='assigned_hotspot_wrapper'
        >
          {client_hotspot?.length > 0 ? (
            client_hotspot.map((hotspot) => (
              <Box
                className='p-0'
                display={{ md: 'flex' }}
                key={hotspot?._id}
                p='4'
                borderRadius='lg'
                mb='3'
                boxShadow='base'
                bg={colorMode === 'light' ? '#f4f5f7' : '#303744'}
              >
                <Box d={{ md: 'flex' }}>
                  <Box className="d-flex align-items-center ml-3">
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
                  <Box className='d-flex align-items-center w-100 p-3'>    
                  {/* // width: 100%;
    // display: flex;
    // justify-content: space-around;> */}
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
                      <Flex className='wrapper-badges ml-md-5' d={{ sm: 'flex' }} mt='2'>
                  <Badge
                      className='badge-relation-type mr-3 ml-0'
                      ml='10px'
                      colorScheme={
                        hotspot?.relation_type === 'host'
                          ? '#F99918'
                          : hotspot?.relation_type === 'referrer'
                          ? '#4AAAE3'
                          : 'pink'
                      }
                    >
                      <span className='text-white'>
                        {hotspot?.relation_type}
                      </span>
                    </Badge>
                    <Badge
                      className='badge-percentage mr-3'
                      color={'#fff'}
                      backgroundColor={'#44BBA4'}
                    >
                      <Text fontSize='xs'>{hotspot?.percentage + '%'}</Text>
                    </Badge>
                    <Badge className='badge-date'>
                      <Text fontSize='xs'>
                        {moment(hotspot?.startDate).format('YYYY-MM-DD')}
                      </Text>
                    </Badge>
                  </Flex>
                    </Box>
                  </Box>
                </Box>
                <Spacer display={{ base: 'none', md: 'block' }} />
                <Flex
                  mt={{ base: '3', md: '0' }}
                  textAlign='right'
                  alignItems='center'
                >
                  <Box>
                    <Text
                      className='total-earned-singular'
                      fontWeight='semibold'
                      color={colorMode === 'light' ? 'white' : ''}
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