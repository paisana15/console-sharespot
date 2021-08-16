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
  Button,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import AlertMessage from '../components/Alert';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import { Bar as Barchart } from 'react-chartjs-2';
import Loader from '../components/Loader';
import UserIcon from '../assets/icons/user-icon.svg';
import PhoneIcon from '../assets/icons/phone-icon.svg';
import MailIcon from '../assets/icons/mail-icon.svg';
import WalletUserIcon from '../assets/icons/wallet-user-icon.svg';
import WalletCircleIcon from '../assets/icons/wallet-circle-icon.svg';
import WalletRequest from '../assets/icons/wallet-request-icon.svg';

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
          `https://api.helium.io/v1/hotspots/${hotspotAddress}/rewards/sum?min_time=-60%20day&bucket=week
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
      <Box className="mt-4">
        <Flex alignItems="center" className="mb-lg-4">
          <Heading
            className="title-underline"
            textColor={`${colorMode === 'light' ? '#0E0C1C' : 'white'}`}
            size="lg"
            mb="1"
          >
            {client?.firstname + ' ' + client?.lastname}
            &nbsp;Wallet
            <hr />
          </Heading>
        </Flex>
        <div className="d-flex flex-column d-lg-flex flex-lg-row justify-content-space-between">
          <div className="mb-4">
            <div className="d-flex flex-column flex-lg-row mb-0 mb-lg-4">
              <div className="col-12 col-lg-3 p-0 mb-3 mt-4 mt-lg-0 mb-lg-0 mr-2">
                <span className="info-user-dashboard">
                  <img
                    className="mr-2"
                    src={UserIcon}
                    alt="User icon"
                    height="20"
                    width="20"
                  />
                  {client?.username}
                </span>
              </div>
              <div className="col-12 col-lg-3 p-0 mb-3 mb-lg-0 mr-md-4">
                <span className="info-user-dashboard ">
                  <img
                    className="mr-2"
                    src={PhoneIcon}
                    alt="Phone icon"
                    height="14"
                    width="14"
                  />
                  {client?.phone_number}
                </span>
              </div>
              <div className="col-12 col-lg-3 p-0 mb-3 mb-lg-0">
                <span className="info-user-dashboard">
                  <img
                    className="mr-2"
                    src={MailIcon}
                    alt="Mail icon"
                    height="23"
                    width="23"
                  />
                  {client?.email}
                </span>
              </div>
            </div>
            <div className="col-12 col-lg-12 p-0 mb-3 mb-lg-0">
              <span className="d-flex info-user-dashboard word-break align-items-center">
                <img
                  className="mr-2"
                  src={WalletUserIcon}
                  alt="Wallet User icon"
                  height="23"
                  width="23"
                />
                {client?.wallet_address}
              </span>
            </div>
          </div>
          <div className="d-flex flex-column container-total flex-md-row">
            <div className="total-wrapper d-flex flex-column">
              <div className="d-flex align-items-center justify-content-space-between mb-4 mb-md-0">
                <h5 className="total-text text-nowrap">Total Rewards</h5>
                <div className="total-rewards text-nowrap mb-md-3 mb-lg-0">
                  <Text style={{ fontWeight: 'bold' }} fontSize="lg">
                    <NumberFormat
                      suffix=" HNT"
                      thousandSeparator={true}
                      displayType="text"
                      value={
                        client_wallet
                          ? client_wallet?.totalRewards?.toFixed(0)
                          : '0'
                      }
                    />
                  </Text>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-space-between">
                <h5 className="total-text text-nowrap">Total Withdrawn</h5>
                <div className="total-withdrawn text-nowrap">
                  <Text style={{ fontWeight: 'bold' }} fontSize="lg">
                    <NumberFormat
                      suffix=" HNT"
                      thousandSeparator={true}
                      displayType="text"
                      value={
                        client_wallet
                          ? client_wallet?.totalWithdraw?.toFixed(0)
                          : '0'
                      }
                    />
                  </Text>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column available-container mt-5 mt-md-0 mt-lg-2">
              <div className="mx-auto">
                <h5 className="total-text">Available</h5>
                <Box
                  className="wallet-circle"
                  bg={colorMode === 'light' ? '#fff' : '#0E0C1C'}
                >
                  <img
                    src={WalletCircleIcon}
                    height="28"
                    width="28"
                    alt="Wallet Circle"
                  />
                </Box>
                <Text style={{ fontWeight: 'bold' }} fontSize="2xl">
                  <NumberFormat
                    suffix=" HNT"
                    thousandSeparator={true}
                    displayType="text"
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
      <Box
        className="spacing-dashboard pl-md-4"
        backgroundColor="#fafafa"
        borderRadius="15px"
        bg={colorMode === 'light' ? '#fafafa' : '#1D1A30'}
      >
        <Box>
          <div className="button-wrapper">
            <Link className="position-request" to={`/c/profile/withdraw`}>
              <Button
                className="button-dashboard bg-blue"
                w={{ base: '100%' }}
                mr={{ md: 2 }}
                mt={{ base: 2, md: 0 }}
                // onClick={getRewardHandler}
                variant={colorMode === 'dark' ? 'outline' : 'solid'}
              >
                <div className="d-flex align-items-center">
                  <img
                    className="mr-2"
                    src={WalletRequest}
                    height="37"
                    width="37"
                    alt="Request Withdraw"
                  />
                  <div className="d-flex flex-column align-items-baseline">
                    <span>Request</span>
                    <span>Withdraw</span>
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
          <Box borderRadius="md">
            {chartData?.length > 0 ? (
              <Box p="3">
                <Heading className="ml-4" size="md">
                  Weekly Rewards
                </Heading>
                <Barchart
                  data={{
                    labels: chartData?.map((data) => data?.date),
                    datasets: [
                      {
                        label: 'Total Rewards',
                        data: chartData?.map((data) => data?.total.toFixed(2)),
                        backgroundColor: 'rgba(67,188,164,0.3)',
                        borderColor: 'rgb(67,188,164)',
                        borderWidth: 1,
                        borderRadius: 50,
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
                <Box
                  className="d-flex flex-column flex-lg-row text-center mt-4 mb-4"
                  pb="2"
                >
                  <Badge
                    textColor={colorMode === 'light' ? '#0E0C1C' : 'white'}
                    className="badge-chart-monthly mb-3 mb-lg-0"
                    variant="outline"
                  >
                    Monthly Rewards: HNT{' '}
                    {chartDaysLoading ? (
                      <Loader xs />
                    ) : (
                      thirtDR && thirtDR.toFixed(2)
                    )}
                  </Badge>
                  <Spacer />
                  <Badge
                    textColor={colorMode === 'light' ? '#0E0C1C' : 'white'}
                    className="badge-chart-weekly mb-3 mb-lg-0"
                    variant="outline"
                  >
                    Weekly Rewards: HNT{' '}
                    {chartDaysLoading ? (
                      <Loader xs />
                    ) : (
                      sevenDR && sevenDR.toFixed(2)
                    )}
                  </Badge>
                  <Spacer />

                  <Badge
                    textColor={colorMode === 'light' ? '#0E0C1C' : 'white'}
                    className="badge-chart-daily"
                    variant="outline"
                  >
                    Daily Rewards: HNT{' '}
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
        <Box className="mt-5 mt-lg-4">
          <Heading className="ml-4 mb-4 d-flex align-items-center" size="md">
            <div className="d-flex">
              <Heading
                className="rectangle-hotspot mr-2"
                border="2px"
                borderColor={colorMode === 'light' ? 'black' : 'white'}
              >
                <Text
                  className="circle-hotspot"
                  border="2px"
                  borderColor={colorMode === 'light' ? 'black' : 'white'}
                />
              </Heading>
            </div>
            Assigned Hotspot ({client?.total_hotspot})&#x0003A;
          </Heading>
          <div className="justify-content-end mr-5 d-none d-md-flex">
            total earned
          </div>
          <Box borderRadius="md" p="5" className="assigned_hotspot_wrapper">
            {client_hotspot?.length > 0 ? (
              client_hotspot.map((hotspot) => (
                <Box
                  className="mb-4"
                  display={{ md: 'flex' }}
                  key={hotspot?._id}
                  borderRadius="20px"
                  bg={colorMode === 'light' ? '#f3f3f3' : '#0E0C1C'}
                >
                  <Box d={{ md: 'flex' }}>
                    <Box className="d-flex align-items-center ml-3 pt-3 pt-md-0">
                      <IconButton
                        mr={{ md: 2 }}
                        color="blue.400"
                        aria-label="Search database"
                        icon={<i className="far fa-chart-bar"></i>}
                        onClick={() =>
                          selectHandler(
                            hotspot?.hotspot_address,
                            hotspot?.percentage
                          )
                        }
                      />
                    </Box>
                    <Box className="d-flex flex-column ml-2 justify-content-center w-100 pb-3 pl-3 pr-3 pt-0 p-md-3">
                      <Heading size="md" className="mb-3 mt-4 mt-md-0">
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`https://explorer.helium.com/hotspots/${hotspot?.hotspot_address}`}
                        >
                          {hotspot?.hotspot_name}
                        </a>
                      </Heading>
                      <Box d={{ sm: 'flex' }}>
                        <Flex className="wrapper-badges" d={{ sm: 'flex' }}>
                          <Badge
                            className="badge-relation-type mr-1 mr-md-3 ml-0"
                            ml="10px"
                            bg={
                              hotspot?.relation_type === 'host'
                                ? '#F99918'
                                : hotspot?.relation_type === 'referrer'
                                ? '#4AAAE3'
                                : 'pink'
                            }
                          >
                            <span className="text-white">
                              {hotspot?.relation_type}
                            </span>
                          </Badge>
                          <Badge
                            className="badge-percentage mr-1 mr-md-3"
                            color={'#fff'}
                            backgroundColor={'#44BBA4'}
                          >
                            <Text fontSize="xs">
                              {hotspot?.percentage + '%'}
                            </Text>
                          </Badge>
                          <Badge
                            className="badge-date"
                            backgroundColor={'transparent'}
                          >
                            <Text fontSize="xs">
                              {moment(hotspot?.startDate).format('YYYY-MM-DD')}
                            </Text>
                          </Badge>
                          <Badge
                            className="badge-date ml-2"
                            backgroundColor={'transparent'}
                          >
                            <Text fontSize="xs">
                              {moment(hotspot?.endDate).format('YYYY-MM-DD')}
                            </Text>
                          </Badge>
                        </Flex>
                      </Box>
                    </Box>
                  </Box>
                  <Spacer display={{ base: 'none', md: 'block' }} />
                  <div className="text-center mt-3 mt-md-0">
                    <Box>
                      <Text
                        className="total-earned-singular"
                        fontWeight="semibold"
                        bg={colorMode === 'light' ? '#313131' : '#292446'}
                        color={colorMode === 'light' ? 'white' : ''}
                        fontSize="sm"
                      >
                        <NumberFormat
                          prefix="HNT "
                          thousandSeparator={true}
                          displayType="text"
                          value={hotspot?.total_earned.toFixed(2)}
                        />
                      </Text>
                    </Box>
                  </div>
                </Box>
              ))
            ) : (
              <AlertMessage status="error" error="No hotspot assigned yet!" />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ClientProfileScreen;
