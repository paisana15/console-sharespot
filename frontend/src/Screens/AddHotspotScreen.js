import React from 'react';
import { Box, Heading } from '@chakra-ui/layout';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/select';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';

const AddHotspotScreen = () => {
  return (
    <Box p="4">
      <Heading size='lg'>Add Hotspot</Heading>
      <Box mt='3'>
        <FormControl id='first-name' isRequired>
          <FormLabel>Select Client</FormLabel>
          <Select placeholder='---'>
            <option value='option1'>Option 1</option>
            <option value='option2'>Option 2</option>
            <option value='option3'>Option 3</option>
          </Select>
        </FormControl>
        <FormControl id='first-name' isRequired>
          <FormLabel>Select Hotspot</FormLabel>
          <Select placeholder='---'>
            <option value='option1'>Option 1</option>
            <option value='option2'>Option 2</option>
            <option value='option3'>Option 3</option>
          </Select>
        </FormControl>
        <FormControl id='first-name' isRequired>
          <FormLabel>Role</FormLabel>
          <Select placeholder='---'>
            <option value='host'>Host</option>
            <option value='referrer'>Referrer</option>
          </Select>
        </FormControl>
        <FormControl id='first-name' isRequired>
          <FormLabel>Percentage</FormLabel>
          <Input />
        </FormControl>
        <Button mt='2' colorScheme='green'>
          Create Agreement
        </Button>
      </Box>
    </Box>
  );
};

export default AddHotspotScreen;
