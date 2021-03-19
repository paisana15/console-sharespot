import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';

const Loader = () => {
  return (
    <Box d='flex' alignItems='center' justifyContent='center'>
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
      />
    </Box>
  );
};

export default Loader;
