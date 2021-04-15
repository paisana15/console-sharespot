import React from 'react';
import { CloseButton } from '@chakra-ui/react'
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';

const AlertMessage = ({ status, error }) => {
  return (
    <div>
      <Alert status={status}>
        <AlertIcon className='text-red'/>
        <AlertTitle className='text-black' mr={2}> {error}</AlertTitle>
        <CloseButton className='text-black' position='absolute' right='8px' top='8px' />
      </Alert>
    </div>
  );
};

export default AlertMessage;
