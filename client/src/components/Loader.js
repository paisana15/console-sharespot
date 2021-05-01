import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';

const Loader = ({ xs, small }) => {
  return (
    <Box
      d={xs ? 'inline-block' : 'flex'}
      alignItems='center'
      justifyContent='center'
    >
      <Spinner
        thickness={xs ? '1px' : '3px'}
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size={small ? 'lg' : xs ? 'xs' : 'xl'}
      />
    </Box>
  );
};

export default Loader;
