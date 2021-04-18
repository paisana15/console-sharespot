import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AlertMessage from '../components/Alert';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { Box, Flex, Spacer, Text } from '@chakra-ui/layout';
import Loader from '../components/Loader';
import NumberFormat from 'react-number-format';
import { FormControl } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/select';

const AllHotspotsScreen = () => {
  const [error, setError] = useState('');
  const [hotspots, setHotspots] = useState([]);
  const [hotspotLoading, setHotspotLoading] = useState(true);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.helium.wtf/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/hotspots`
        );
        if (response) {
          // 24 hour reward
          const lastDayReward = await Promise.all(
            response?.data?.data?.map(async (data) => {
              const response = await axios.get(
                `https://api.helium.wtf/v1/hotspots/${data?.address}/rewards/sum?min_time=-1%20day&bucket=day`
              );
              const result = response?.data?.data?.[0]?.total;
              return result;
            })
          );

          // get last week rewards
          const weekReward = await Promise.all(
            response?.data?.data?.map(async (data) => {
              const response = await axios.get(
                `https://api.helium.wtf/v1/hotspots/${data?.address}/rewards/sum?min_time=-7%20day&bucket=day`
              );
              const result = response?.data?.data
                ?.map((d) => d.total)
                .reduce((acc, curr) => acc + curr);
              return result;
            })
          );

          // get last month rewards
          const monthReward = await Promise.all(
            response?.data?.data?.map(async (data) => {
              const response = await axios.get(
                `https://api.helium.wtf/v1/hotspots/${data?.address}/rewards/sum?min_time=-30%20day&bucket=day`
              );
              const result = response?.data?.data
                ?.map((d) => d.total)
                .reduce((acc, curr) => acc + curr);
              return result;
            })
          );

          // get all time reward
          const allTimeReward = await Promise.all(
            response?.data?.data?.map(async (data) => {
              const response = await axios.get(
                `https://api.helium.io/v1/hotspots/${data?.address}/rewards/sum?max_time=&min_time=2019-01-01`
              );
              const result = response?.data?.data?.total;
              return result;
            })
          );

          // push APIs data
          const apiData = response?.data?.data?.map((data, idx) => {
            const newObject = {
              name: data?.name,
              address: data?.address,
              status: data?.status?.online,
              location: data?.geocode?.long_city,
              last_day_rewards: lastDayReward[idx],
              last_week_rewards: weekReward[idx],
              last_month_rewards: monthReward[idx],
              all_time_rewards: allTimeReward[idx],
            };
            return newObject;
          });
          setHotspots(apiData);
          setHotspotLoading(false);
        } else {
          setHotspotLoading(false);
          throw new Error('Failed to fetch API data! Try again later.');
        }
      } catch (error) {
        setHotspotLoading(false);
        setError(error.message);
      }
    }
    fetchData();
    return () => {
      abortController.abort();
    };
  }, []);

  const hotspotsData = hotspots?.sort((a, b) => {
    if (filterValue && filterValue === '') {
      return hotspots;
    } else {
      if (filterValue === 'de_a') {
        return a.last_day_rewards - b.last_day_rewards;
      } else if (filterValue === 'de_d') {
        return b.last_day_rewards - a.last_day_rewards;
      } else if (filterValue === 'we_a') {
        return a.last_week_rewards - b.last_week_rewards;
      } else if (filterValue === 'we_d') {
        return b.last_week_rewards - a.last_week_rewards;
      } else if (filterValue === 'me_a') {
        return a.last_month_rewards - b.last_month_rewards;
      } else if (filterValue === 'me_d') {
        return b.last_month_rewards - a.last_month_rewards;
      } else if (filterValue === 'ae_a') {
        return a.all_time_rewards - b.all_time_rewards;
      } else if (filterValue === 'ae_d') {
        return b.all_time_rewards - a.all_time_rewards;
      } else {
        return null;
      }
    }
  });

  return (
    <>
      <Box p='4'>
        <Box mb='2' d={{ md: 'flex' }}>
          <Text d='inline-block' fontSize='2xl' className='adminPageHeader'>
            All Hotspots ({hotspots ? hotspots?.length : '0'})
          </Text>
          <Spacer />
          <Box d='inline-block'>
            <FormControl>
              <Select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                size='sm'
                placeholder='Sort By'
                variant='flushed'
              >
                <option value='de_a'>Daily Earning (Ascending)</option>
                <option value='de_d'>Daily Earning (Descensing)</option>
                <option value='we_a'>Weekly Earning (Ascending)</option>
                <option value='we_d'>Weekly Earning (Descensing)</option>
                <option value='me_a'>Monthly Earning (Ascending)</option>
                <option value='me_d'>Monthly Earning (Descensing)</option>
                <option value='ae_a'>All Time (Ascending)</option>
                <option value='ae_d'>All Time (Descensing)</option>
              </Select>
            </FormControl>
          </Box>
        </Box>
        {hotspotLoading ? (
          <Loader />
        ) : (
          hotspotsData &&
          hotspotsData?.length > 0 && (
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
                {hotspotsData?.map((data, idx) => (
                  <Tr key={idx}>
                    <Td>
                      <Flex alignItems='center'>
                        <Box
                          w='1.5'
                          h='1.5'
                          mr='1.5'
                          bg={
                            data?.status === 'online' ? 'green.400' : 'red.500'
                          }
                          rounded
                          borderRadius='50%'
                        ></Box>

                        <Box>
                          <Box>{data?.name.toUpperCase()}</Box>
                          <Box textColor='gray.500' fontSize='xs'>
                            {data?.location}
                          </Box>
                        </Box>
                      </Flex>
                    </Td>
                    <Td isNumeric>{data?.last_day_rewards?.toFixed(2)}</Td>
                    <Td isNumeric>{data?.last_week_rewards?.toFixed(2)}</Td>
                    <Td isNumeric>{data?.last_month_rewards?.toFixed(2)}</Td>
                    <Td isNumeric>
                      {
                        <NumberFormat
                          displayType='text'
                          value={data?.all_time_rewards?.toFixed(2)}
                          thousandSeparator={true}
                        />
                      }
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
