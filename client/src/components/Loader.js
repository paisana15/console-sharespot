import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';

const Loader = ({ small }) => {
  return (
    <Box d='flex' alignItems='center' justifyContent='center'>
      <Spinner
        thickness='3px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size={small ? 'lg' : 'xl'}
      />
    </Box>
  );
};

export default Loader;
