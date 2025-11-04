import React, { useState } from 'react';
import FullPageMenu from './FullPageMenu';

interface MenuItem {
  id: number;
  label: string;
  link: string;
}

interface HeaderProps {
  menuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  { id: 1, label: 'Home', link: '#home' },
  { id: 2, label: 'Services', link: '#services' },
  { id: 3, label: 'Gallery', link: '#gallery' },
  { id: 4, label: 'About', link: '#about' },
  { id: 5, label: 'Contact', link: '#contact' }
];

const Header: React.FC<HeaderProps> = ({ menuItems = defaultMenuItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <FullPageMenu isOpen={isMenuOpen} onToggle={toggleMenu} />
    </>
  );
};

export default Header;
