import { Box, Container, Spacer } from '@chakra-ui/layout';
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Box color='white' overflow='hidden' bg='#2f2f2f' w='100%' p='4'>
      <Container maxW='container.lg'>
        <Box d='flex' alignItems='baseline'>
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xs'
            cursor='pointer'
            textTransform='uppercase'
          >
            <Link to='/'>About</Link>
          </Box>
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xs'
            textTransform='uppercase'
            ml='6'
            cursor='pointer'
          >
            <Link to='/'>Home</Link>
          </Box>
          <Spacer />
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xs'
            cursor='pointer'
            textTransform='uppercase'
            _hover='color: white'
          >
            Login
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
