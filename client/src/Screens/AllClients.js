import React, { useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/layout';
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
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClients } from '../redux/action/AdminAction';
import Loader from '../components/Loader';
import AlertMessage from '../components/Alert';
import { Helmet } from 'react-helmet';

const AllClients = () => {
  const dispatch = useDispatch();

  const allClientsGet = useSelector((state) => state.allClientsGet);
  const { loading, clients, error } = allClientsGet;

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);

  return (
    <Box p='4'>
      <Helmet>
        <title>All Clients | Admin Dashboard</title>
      </Helmet>
      <Flex mb='3' alignItems='center'>
        <Text fontSize='2xl' className='adminPageHeader'>
          All Clients
        </Text>
        <Spacer />
        <Box>
          <Link to={`/h/add-new-client`}>
            <Button variant='solid' size='sm' colorScheme='purple'>
              <i className='fas fa-user-plus' style={{ marginRight: 5 }}></i>{' '}
              Add New Client
            </Button>
          </Link>
        </Box>
      </Flex>
      <Box>
        {loading ? (
          <Loader />
        ) : error ? (
          <AlertMessage status='error' error={error} />
        ) : clients && clients?.length > 0 ? (
          <Table shadow='lg' size='sm' variant='striped'>
            <TableCaption>
              All client list with their total hotspot.
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Client Name</Th>
                <Th isNumeric>Total Hotspot</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clients?.map((client) => (
                <Tr key={client?._id}>
                  <Td>
                    <Link to={`/h/client/${client?._id}`}>
                      {client?.firstname + ' ' + client?.lastname}
                    </Link>
                  </Td>
                  <Td isNumeric>{client?.total_hotspot}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <AlertMessage status='error' error='No clients found!' />
        )}
      </Box>
    </Box>
  );
};

export default AllClients;
