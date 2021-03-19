import React from 'react';
import { Alert, AlertIcon } from '@chakra-ui/alert';

const AlertMessage = ({ status, error }) => {
  return (
    <div>
      <Alert status={status}>
        <AlertIcon />
        {error}
      </Alert>
    </div>
  );
};

export default AlertMessage;
