import React from 'react';
import { Box, Container, Flex, Spacer, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Link } from 'react-router-dom';

const WelcomeScreen = () => {
  return (
    <Box w='100%' h='100vh' bg='facebook.900' textAlign='center'>
      <Box w='100%' d='flex' alignItems='center' h='12' bg='gray.900'>
        <Container maxW='container.xl'>
          <Flex alignItems='center'>
            <Text>Your App Name</Text>
            <Spacer />
            <Link to='/login'>
              <Button
                variant='outline'
                colorScheme='whatsapp'
                color='whatsapp.400'
              >
                Login
              </Button>
            </Link>
          </Flex>
        </Container>
      </Box>
      <Text fontSize='5xl' textTransform='uppercase'>
        Estamos a expandir a rede das cidades inteligentes IoT em Portugal Com a
        sharespot poderás conectar milhões de sensores das cidades inteligentes.
        Contribui para a expansão da rede e recebe rendimento passivo.
      </Text>
    </Box>
  );
};

export default WelcomeScreen;
