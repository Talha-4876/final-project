import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Tables', path: '/tables' },
    { name: 'Contact Us', path: '/contact us' },
  ];

  return (
    <footer className="bg-gray-800 text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-orange-500  cursor-pointer">Bite Boss</h3>
          <p>123 Main Street, Your City</p>
          <p>Email: info@biteboss.com</p>
          <p>Phone: +92 300 1234567</p>

          <div className="flex gap-4 mt-4 cursor-pointer">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-orange-500 "><FaFacebook size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-orange-500 "><FaTwitter size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-orange-500 "><FaInstagram size={20} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-orange-500 "><FaLinkedin size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-orange-500  cursor-pointer">Quick Links</h3>
          <ul className="flex flex-col gap-2 ">
            {quickLinks.map(link => (
              <li key={link.name}>
                <button
                  onClick={() => navigate(link.path)}
                  className="hover:text-orange-500 transition  cursor-pointer"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter / Placeholder */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-orange-500  cursor-pointer">Newsletter</h3>
          <p className="mb-4">Subscribe to get latest updates and offers.</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-l border border-gray-300 w-full focus:outline-none"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r text-white font-semibold  cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700 mt-6 py-4 text-center text-gray-400">
        &copy; {new Date().getFullYear()} Bite Boss. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
