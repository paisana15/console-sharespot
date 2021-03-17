import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/table';
import { Spacer, Button } from '@chakra-ui/react';
import { Link, useRouteMatch } from 'react-router-dom';

const AllClients = () => {
  const { url } = useRouteMatch();

  return (
    <Box p='4'>
      <Flex mb='3'>
        <Heading size='lg'>All Cients</Heading>
        <Spacer />
        <Box>
          <Button variant='solid' colorScheme='green'>
            <i className='fas fa-user-plus' style={{ marginRight: 5 }}></i> Add
            New Client
          </Button>
        </Box>
      </Flex>
      <Box>
        <Table shadow='md' size='sm' borderWidth='1px' variant='striped'>
          <TableCaption>All client list with their total hotspot.</TableCaption>
          <Thead>
            <Tr>
              <Th>Client</Th>
              <Th isNumeric>Total Hotspot</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Link to={`${url}/clients/:clientId`}>
                <Td>John</Td>
              </Link>
              <Td isNumeric>4</Td>
            </Tr>
            <Tr>
              <Td>Jane</Td>
              <Td isNumeric>1</Td>
            </Tr>
            <Tr>
              <Td>Max Ty</Td>
              <Td isNumeric>2</Td>
            </Tr>
            <Tr>
              <Td>John</Td>
              <Td isNumeric>4</Td>
            </Tr>
            <Tr>
              <Td>Jane</Td>
              <Td isNumeric>1</Td>
            </Tr>
            <Tr>
              <Td>Max Ty</Td>
              <Td isNumeric>2</Td>
            </Tr>
            <Tr>
              <Td>John</Td>
              <Td isNumeric>4</Td>
            </Tr>
            <Tr>
              <Td>Jane</Td>
              <Td isNumeric>1</Td>
            </Tr>
            <Tr>
              <Td>Max Ty</Td>
              <Td isNumeric>2</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default AllClients;
