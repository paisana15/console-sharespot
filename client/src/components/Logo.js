import React from 'react';
import { Text } from '@chakra-ui/layout';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div>
      <Text fontSize='xl'>
        <Link to='/'>Logo</Link>
      </Text>
    </div>
  );
};

export default Logo;
