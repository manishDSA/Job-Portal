import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t shadow-xl border-t-gray-200 py-8">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h5 className="text-xl font-bold">Job Hunt</h5>
        <p className='text-sm'>&copy; 2024 All Rights Reserved</p>
      </div>

      <div className="flex space-x-4">
        <a href="#" className="hover:text-gray-500">
          <FontAwesomeIcon icon={faFacebook} size="2x" className="text-black" />
        </a>
        <a href="#" className="hover:text-gray-500">
          <FontAwesomeIcon icon={faTwitter} size="2x" className="text-black" />
        </a>
        <a href="#" className="hover:text-gray-500">
          <FontAwesomeIcon icon={faInstagram} size="2x" className="text-black" />
        </a>
      </div>
    </div>
  </footer>
  );
}

export default Footer;
