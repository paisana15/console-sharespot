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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useHistory, useRouteMatch } from 'react-router';
import AlertMessage from '../components/Alert';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import moment from 'moment';

const ClientProfileScreen = ({ client_details }) => {
  const dispatch = useDispatch();
  const { url } = useRouteMatch();
  const { colorMode } = useColorMode();
  const [client, setClient] = useState({});
  const [client_hotspot, setClientHotspot] = useState([]);
  const [client_wallet, setClientWallet] = useState({});
  const history = useHistory();

  useEffect(() => {
    setClient(client_details?.client);
    setClientHotspot(client_details?.client_hotspot);
    setClientWallet(client_details?.clientWallet);
  }, [client_details, history]);

  return (
    <>
      <Box>
        <Flex align='center'>
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
        <Flex>
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-user'></i> Username : {client?.username}
          </Text>
          <Spacer />
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-at'></i> Email : {client?.email}
          </Text>
        </Flex>
        <Flex>
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-phone-alt'></i> Phone : {client?.phone_number}
          </Text>
          <Spacer />
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-wallet'></i> Wallet Address :{' '}
            {client?.wallet_address}
          </Text>
        </Flex>
      </Box>
      <Flex color='white' mt='3'>
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='red.400'
          w='30%'
        >
          <Heading size='md'>Total Withdrawn</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {`HNT ${
              client_wallet ? client_wallet?.totalWithdraw?.toFixed(2) : '0'
            }`}
          </Text>
        </Box>
        <Spacer />
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='green.400'
          w='30%'
        >
          <Heading size='md'>Total Rewards</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {`HNT ${
              client_wallet ? client_wallet?.totalRewards?.toFixed(2) : '0'
            }`}
          </Text>
        </Box>
        <Spacer />
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='blue.400'
          w='30%'
        >
          <Heading size='md'>Balance</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {`HNT ${
              client_wallet ? client_wallet?.wallet_balance?.toFixed(2) : '0'
            }`}
          </Text>
        </Box>
      </Flex>
      <Box mt='4'>
        <Heading size='xs'>Assigned Hotspot ({client?.total_hotspot})</Heading>
        <Box
          mt='3'
          boxShadow='md'
          borderRadius='md'
          p='5'
          className='assigned_hotspot_wrapper'
        >
          {client_hotspot?.length > 0 ? (
            client_hotspot.map((hotspot) => (
              <Flex
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
                    <Text fontSize='xs' ml='2' mr='1'>
                      From
                    </Text>
                    <Badge colorScheme='blue'>
                      <Text fontSize='xs'>
                        {moment(hotspot?.startDate).format('YYYY-MM-DD')}
                      </Text>
                    </Badge>
                  </Flex>
                </Box>
                <Spacer />
                <Flex textAlign='right' alignItems='center'>
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
                </Flex>
              </Flex>
            ))
          ) : (
            <AlertMessage status='error' error='No hotspot assigned yet!' />
          )}
        </Box>
        <Button mt='3' colorScheme="pink" variant={colorMode === 'dark' ? 'outline' : 'solid'}>
          Get Reward
        </Button>
      </Box>
    </>
  );
};

export default ClientProfileScreen;
