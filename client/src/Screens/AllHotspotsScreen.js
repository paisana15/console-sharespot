import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AlertMessage from '../components/Alert';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { Box, Flex, Text } from '@chakra-ui/layout';
import Loader from '../components/Loader';
import NumberFormat from 'react-number-format';

const AllHotspotsScreen = () => {
  const [error, setError] = useState('');
  const [lastDR, setLastDr] = useState([]);
  const [lastDRLoading, setLastDrLoading] = useState(true);
  const [sevenDR, setWeekR] = useState([]);
  const [sevenDRLoading, setSevenDrLoading] = useState(true);
  const [lastMR, setLastMR] = useState([]);
  const [lastMRLoading, setLastMrLoading] = useState(true);
  const [allTimeReward, setAllTimeR] = useState([]);
  const [allTRLoading, setAllTRLoading] = useState(true);
  const [hotspots, setHotspots] = useState([]);
  const [hotspotLoading, setHotspotLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.helium.io/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/hotspots`
        );
        if (response) {
          setHotspots(response?.data?.data);
          setHotspotLoading(false);
          // 24 hour reward
          const lastDataRes = await Promise.all(
            response?.data?.data?.map(async (data) => {
              const response = await axios.get(
                `https://api.helium.io/v1/hotspots/${data?.address}/rewards/sum?min_time=-1%20day&bucket=day`
              );
              const result = response?.data?.data?.[0]?.total.toFixed(2);
              return result;
            })
          );
          setLastDr(lastDataRes);
          setLastDrLoading(false);

          // get last week rewards
          const weekReward = await Promise.all(
            response?.data?.data?.map(async (data) => {
              const response = await axios.get(
                `https://api.helium.io/v1/hotspots/${data?.address}/rewards/sum?min_time=-7%20day&bucket=day`
              );
              const result = response?.data?.data
                ?.map((d) => d.total)
                .reduce((acc, curr) => acc + curr);
              return result;
            })
          );
          setWeekR(weekReward);
          setSevenDrLoading(false);

          // get last month rewards
          const monthReward = await Promise.all(
            response?.data?.data?.map(async (data) => {
              const response = await axios.get(
                `https://api.helium.io/v1/hotspots/${data?.address}/rewards/sum?min_time=-30%20day&bucket=day`
              );
              const result = response?.data?.data
                ?.map((d) => d.total)
                .reduce((acc, curr) => acc + curr);
              return result;
            })
          );
          setLastMR(monthReward);
          setLastMrLoading(false);

          // get all time reward
          const allTimeReward = await Promise.all(
            response?.data?.data?.map(async (data) => {
              const response = await axios.get(
                `https://api.helium.io/v1/hotspots/${data?.address}/rewards/sum?max_time=&min_time=2019-01-01`
              );
              const result = response?.data?.data?.total.toFixed(2);
              return result;
            })
          );
          setAllTimeR(allTimeReward);
          setAllTRLoading(false);
        } else {
          setHotspotLoading(false);
          throw new Error('Failed to fetch API data! Try again later.');
        }
      } catch (error) {
        setHotspotLoading(false);
        setSevenDrLoading(false);
        setLastDrLoading(false);
        setLastMrLoading(false);
        setAllTRLoading(false);
        setError(error.message);
      }
    }
    fetchData();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      <Box p='4'>
        <Text d='inline-block' fontSize='2xl' className='adminPageHeader'>
          All Hotspots ({hotspots ? hotspots?.length : '0'})
        </Text>
        {hotspotLoading ? (
          <Loader />
        ) : (
          hotspots &&
          hotspots?.length > 0 && (
            <Table shadow='lg' size='sm' variant='striped'>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th isNumeric>Last 24 Hours</Th>
                  <Th isNumeric>Last 7 Days</Th>
                  <Th isNumeric>Last Month</Th>
                  <Th isNumeric>All Time (HNT)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {hotspots?.map((data, idx) => (
                  <Tr key={idx}>
                    <Td>
                      <Flex alignItems='center'>
                        <Box
                          w='1.5'
                          h='1.5'
                          mr='1.5'
                          bg={
                            data?.status?.online === 'online'
                              ? 'green.400'
                              : 'red.500'
                          }
                          rounded
                          borderRadius='50%'
                        ></Box>

                        <Box>
                          <Box>{data?.name.toUpperCase()}</Box>
                          <Box textColor='gray.500' fontSize='xs'>
                            {data?.geocode?.long_city}
                          </Box>
                        </Box>
                      </Flex>
                    </Td>
                    <Td isNumeric>
                      {lastDRLoading ? <Loader xs /> : lastDR[idx]}
                    </Td>
                    <Td isNumeric>
                      {sevenDRLoading ? (
                        <Loader xs />
                      ) : (
                        sevenDR[idx]?.toFixed(2)
                      )}
                    </Td>
                    <Td isNumeric>
                      {lastMRLoading ? <Loader xs /> : lastMR[idx]?.toFixed(2)}
                    </Td>
                    <Td isNumeric>
                      {allTRLoading ? (
                        <Loader xs />
                      ) : (
                        <NumberFormat
                          displayType='text'
                          value={allTimeReward[idx]}
                          thousandSeparator={true}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )
        )}
      </Box>

      {error && <AlertMessage status='error' error={error} />}
    </>
  );
};

export default AllHotspotsScreen;
