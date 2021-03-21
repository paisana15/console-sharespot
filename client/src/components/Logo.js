import React from 'react';
import { Text } from '@chakra-ui/layout';
import { Link } from 'react-router-dom';
import { Image } from '@chakra-ui/react';
import logo from '../assets/images/logo.png';

const Logo = () => {
  return (
    <div>
      <Text fontSize='xl'>
        <Link to='/'>
          <Image w='10' h='10' src={logo} />
        </Link>
      </Text>
    </div>
  );
};

export default Logo;
