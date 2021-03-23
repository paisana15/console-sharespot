import React from 'react';
import { Box, Container, Flex, Spacer, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Helmet } from 'react-helmet';

const WelcomeScreen = () => {
  return (
    <Box w='100%' h='100vh' bg='facebook.900' textAlign='center'>
      <Helmet>
        <title>Sharespot Wallet</title>
      </Helmet>
      <Box w='100%' d='flex' alignItems='center' h='12' bg='gray.900'>
        <Container maxW='container.xl'>
          <Flex alignItems='center'>
            <Logo />
            <Text fontSize='xl' fontStyle='oblique' fontWeight='bold' ml='3'>
              Sharespot Wallet
            </Text>
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
      <Container mt='3' maxW='container.xl'>
        <Text textTransform='uppercase'>
          Estamos a expandir a rede das cidades inteligentes IoT em Portugal Com
          a sharespot poderás conectar milhões de sensores das cidades
          inteligentes. Contribui para a expansão da rede e recebe rendimento
          passivo.
        </Text>
      </Container>
    </Box>
  );
};

export default WelcomeScreen;
