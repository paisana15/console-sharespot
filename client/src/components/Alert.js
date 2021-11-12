import React from 'react';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';

const AlertMessage = ({ status, error }) => {
  return (
    <Alert status={status}>
      <AlertIcon className='text-red' />
      <AlertTitle className='text-black' mr={2}>
        {error}
      </AlertTitle>
    </Alert>
  );
};

export default AlertMessage;
