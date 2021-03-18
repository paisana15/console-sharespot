import React from 'react';
import {
  Box,
  Text,
  Flex,
  Heading,
  Spacer,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router';

const ClientProfileScreen = () => {
  const { url } = useRouteMatch();
  return (
    <>
      <Box>
        <Flex align='center'>
          <Heading textColor='gray.600' size='lg'>
            John Doe
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
            <i className='fas fa-user'></i> Username : john
          </Text>
          <Spacer />
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-at'></i> Email : johyn@gmail.com
          </Text>
        </Flex>
        <Flex>
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-phone-alt'></i> Phone : +362200000
          </Text>
          <Spacer />
          <Text color='gray.500' fontSize='sm'>
            <i className='fas fa-wallet'></i> Wallet Address :
            ijkilajsfg6hufyukiloaposas54d3fg
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
            $54
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
            $454
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
            $400
          </Text>
        </Box>
      </Flex>
      <Box mt='4'>
        <Heading size='xs'>Assigned Hotspot</Heading>
        <Box mt='3'>
          <Flex p='4' borderRadius='lg' mb='3' boxShadow='base'>
            <Box>
              <Heading size='sm'>Main Tiger Snake</Heading>
              <Flex mt='2'>
                <Text fontSize='xs' mr='1'>
                  Percentage
                </Text>
                <Badge colorScheme={'green'}>
                  <Text fontSize='xs'>20%</Text>
                </Badge>
                <Badge ml='10px' colorScheme='purple'>
                  <Text fontSize='xs'>Host</Text>
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
        </Box>
      </Box>
    </>
  );
};

export default ClientProfileScreen;
