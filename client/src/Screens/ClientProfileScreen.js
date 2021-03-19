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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import AlertMessage from '../components/Alert';

const ClientProfileScreen = ({ client_details }) => {
  const { url } = useRouteMatch();
  const { colorMode } = useColorMode();
  const [client, setClient] = useState({});
  const [client_hotspot, setClientHotspot] = useState([]);
  const [client_wallet, setClientWallet] = useState({});

  useEffect(() => {
    setClient(client_details?.client);
    setClientHotspot(client_details?.client_hotspot);
    setClientWallet(client_details?.clientWallet);
  }, [client_details]);

  return (
    <>
      <Box>
        <Flex align='center'>
          <Heading
            textColor={`${colorMode === 'light' ? 'gray.600' : '#b3bfd4'}`}
            size='lg'
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
            <i className='fas fa-wallet'></i> Wallet Address :
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
            {`$ ${client_wallet ? client_wallet?.totalWithdraw : '0'}`}
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
            {`$ ${client_wallet ? client_wallet?.totalRewards : '0'}`}
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
            {`$ ${client_wallet ? client_wallet?.wallet_balance : '0'}`}
          </Text>
        </Box>
      </Flex>
      <Box mt='4'>
        <Heading size='xs'>Assigned Hotspot</Heading>
        <Box mt='3'>
          {client_hotspot.length > 0 ? (
            client_hotspot.map((hotspot) => (
              <Flex
                key={hotspot?._id}
                p='4'
                borderRadius='lg'
                mb='3'
                boxShadow='base'
              >
                <Box>
                  <Heading size='sm'>{hotspot?.name}</Heading>
                  <Flex mt='2'>
                    <Text fontSize='xs' mr='1'>
                      Percentage
                    </Text>
                    <Badge colorScheme={'green'}>
                      <Text fontSize='xs'>{hotspot?.percentage}</Text>
                    </Badge>
                    <Badge ml='10px' colorScheme='purple'>
                      <Text fontSize='xs'>{hotspot?.relation_type}</Text>
                    </Badge>
                  </Flex>
                </Box>
                <Spacer />
                <Box textAlign='right'>
                  <Text fontSize='sm' color='grey'>
                    Total Earned
                  </Text>
                  <Text fontWeight='bold' color='grey' fontSize='sm'>
                    $89
                  </Text>
                </Box>
              </Flex>
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
