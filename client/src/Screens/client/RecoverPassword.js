import React from 'react';
import { Heading } from '@chakra-ui/react';
import NavbarLogin from '../../components/NavbarLogin';
import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/button';

const RecoverPassword = () => {
  return (
    <div className='login-screen'>
      <NavbarLogin />
      <div className='login-card'>
        <div className='d-flex justify-content-space-between'>
          <Heading
            className='title-underline text-color-black'
            as='h5'
            size='lg'
          >
            Recover Password
            <hr />
          </Heading>
        </div>
        <div className='d-flex flex-column align-items-center mt-5 mt-md-3 text-color-black'>
          <span>In order to recover your</span>
          <span>password please reach out.</span>

          <br />
          <a
            href='mailto:support@sharespot.pt'
            target='_blank'
            rel='noopener noreferrer'
          >
            <span className='font-weight-bold'>support@sharespot.pt</span>
          </a>
          <Link to='/login'>
            <Button className='back-btn ml-0 mt-5'>Back</Button>
          </Link>
        </div>
      </div>
      <a href='https://sharespot.pt' target='_blank' rel='noopener noreferrer'>
        <span className='sharespot-bottom font-weight-bold'>sharespot.pt</span>
      </a>
    </div>
  );
};

export default RecoverPassword;
