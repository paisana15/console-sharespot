import { useColorMode } from '@chakra-ui/color-mode';
import { Box, Text } from '@chakra-ui/layout';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';

const AgreementInfo = ({ agreement }) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      className='p-2'
      border='1px'
      borderColor='blue.500'
      rounded='md'
      mb='2'
      shadow='sm'
    >
      <Box>
        <Link to={`/h/client/${agreement?.client_id?._id}`}>
          <Text
            fontSize='lg'
            color={colorMode === 'light' ? 'gray.500' : 'gray.300'}
            cursor='pointer'
            _hover={{ color: 'blue.500' }}
          >
            {agreement?.client_id?.firstname +
              ' ' +
              agreement?.client_id?.lastname}
          </Text>
        </Link>
        <Text
          fontSize='xs'
          color={colorMode === 'light' ? 'gray.400' : 'gray.300'}
        >
          <i className='fas fa-calendar-day mr-1'></i>
          {moment(agreement?.startDate).format('L')} -{' '}
          {moment(agreement?.endDate).format('L')}
        </Text>
      </Box>
      <Box display='flex' className='mt-2 align-items-center '>
        <Box w='50%' textAlign='center'>
          <Text fontSize='xs' color='gray.400'>
            Role
          </Text>
          <Text
            fontSize='sm'
            color={colorMode === 'light' ? 'gray.500' : 'gray.300'}
          >
            {agreement?.relation_type === 'referrer'
              ? 'Referrer'
              : agreement?.relation_type === 'host'
              ? 'Host'
              : agreement?.relation_type === 'hold' && 'Hold'}
          </Text>
        </Box>

        <Box w='50%' textAlign='center'>
          <Text fontSize='xs' color='gray.400'>
            Commision
          </Text>
          <Text
            fontSize='sm'
            color={colorMode === 'light' ? 'gray.500' : 'gray.300'}
          >
            {agreement?.percentage}%<i className='fas fa-link ml-1'></i>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default AgreementInfo;
