import React from 'react';
import { Box, Text, Flex, Heading, Spacer, Badge } from '@chakra-ui/react';
const ClientDetails = () => {
  return (
    <Box p='4'>
      <Flex>
        <Heading size='lg'>John Doe</Heading>
        <Spacer />
        {/* <Button colorScheme='telegram'>More</Button> */}
      </Flex>
      <Flex color='white' mt='3'>
        <Box textAlign='center' p='4' borderRadius='lg' bg='red.400' w='30%'>
          <Heading size='md'>Total Withdrawn</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            $54
          </Text>
        </Box>
        <Spacer />
        <Box textAlign='center' p='4' borderRadius='lg' bg='green.400' w='30%'>
          <Heading size='md'>Total Rewards</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            $454
          </Text>
        </Box>
        <Spacer />
        <Box textAlign='center' p='4' borderRadius='lg' bg='blue.400' w='30%'>
          <Heading size='md'>Balance</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            $400
          </Text>
        </Box>
      </Flex>
      <Box mt='4'>
        <Heading size='xs'>Assigned Hotspot</Heading>
        <Box mt='3'>
          <Flex p='4' borderRadius='lg' mb='3' boxShadow='base'>
            <Box>
              <Heading size='sm'>Main Tiger Snake</Heading>
              <Flex mt='2'>
                <Text fontSize='xs'>Percentage 20%</Text>
                <Badge ml='10px' colorScheme='purple'>
                  <Text fontSize='xs'>Host</Text>
                </Badge>
              </Flex>
            </Box>
            <Spacer />
            <Box textAlign='right'>
              <Text fontSize='sm' color='grey'>
                Total Earned
              </Text>
              <Text fontWeight='bold' color='grey' fontSize='sm'>
                $89
              </Text>
            </Box>
          </Flex>
          <Flex p='4' borderRadius='lg' mb='3' boxShadow='base'>
            <Box>
              <Heading size='sm'>Main Tiger Snake</Heading>
              <Flex mt='2'>
                <Text fontSize='xs'>Percentage 20%</Text>
                <Badge ml='10px' colorScheme='purple'>
                  <Text fontSize='xs'>Host</Text>
                </Badge>
              </Flex>
            </Box>
            <Spacer />
            <Box textAlign='right'>
              <Text fontSize='sm' color='grey'>
                Total Earned
              </Text>
              <Text fontWeight='bold' color='grey' fontSize='sm'>
                $89
              </Text>
            </Box>
          </Flex>
          <Flex p='4' borderRadius='lg' mb='3' boxShadow='base'>
            <Box>
              <Heading size='sm'>Main Tiger Snake</Heading>
              <Flex mt='2'>
                <Text fontSize='xs'>Percentage 20%</Text>
                <Badge ml='10px' colorScheme='blue'>
                  <Text fontSize='xs'>Referrer</Text>
                </Badge>
              </Flex>
            </Box>
            <Spacer />
            <Box textAlign='right'>
              <Text fontSize='sm' color='grey'>
                Total Earned
              </Text>
              <Text fontWeight='bold' color='grey' fontSize='sm'>
                $89
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientDetails;
