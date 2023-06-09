import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Logo = () => {
  return (
    <div>
        <Link to='/'>
          <img height='110' width='110' src={logo} alt='Sharespot Logo'/>
        </Link>
    </div>
  );
};

export default Logo;
