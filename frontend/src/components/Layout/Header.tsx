import React from 'react';
import { StaggeredMenu } from './StaggeredMenu';
import { SiteSettings } from '../../services/api';

interface HeaderProps {
  settings: SiteSettings | null;
}

const Header: React.FC<HeaderProps> = ({ settings }) => {
  // Transform settings from Wagtail API to StaggeredMenu format
  const menuItems = settings?.header?.menu_items?.length
    ? settings.header.menu_items.map(item => ({
        label: item.label,
        ariaLabel: item.aria_label,
        link: item.link,
        subItems: item.subItems
      }))
    : [
        { 
          label: 'Home', 
          ariaLabel: 'Go to home page', 
          link: '/shambala_homes/' 
        },
        { 
          label: 'House Designs', 
          ariaLabel: 'View house designs', 
          link: '/shambala_homes/house-designs',
          subItems: [
            { label: 'All House Designs', link: '/shambala_homes/house-designs' },
            { label: 'Single Storey', link: '/shambala_homes/house-designs?storey=1' },
            { label: 'Double Storey', link: '/shambala_homes/house-designs?storey=2' },
            { label: 'Luxury Homes', link: '/shambala_homes/house-designs?category=luxury' },
            { label: 'Family Homes', link: '/shambala_homes/house-designs?category=family' }
          ]
        },
        { 
          label: 'About', 
          ariaLabel: 'Learn about us', 
          link: '/shambala_homes/about',
          subItems: [
            { label: 'About Us', link: '/shambala_homes/about' },
            { label: 'Our Story', link: '/shambala_homes/about/story' },
            { label: 'Our Team', link: '/shambala_homes/about/team' },
            { label: 'Testimonials', link: '/shambala_homes/about/testimonials' }
          ]
        },
        { 
          label: 'Services', 
          ariaLabel: 'View our services', 
          link: '/shambala_homes/services',
          subItems: [
            { label: 'All Services', link: '/shambala_homes/services' },
            { label: 'Design & Build', link: '/shambala_homes/services/design-build' },
            { label: 'Renovations', link: '/shambala_homes/services/renovations' },
            { label: 'Custom Homes', link: '/shambala_homes/services/custom-homes' },
            { label: 'Consultations', link: '/shambala_homes/services/consultations' }
          ]
        },
        { 
          label: 'Contact', 
          ariaLabel: 'Get in touch', 
          link: '/shambala_homes/contact' 
        }
      ];

  

  return (
    <StaggeredMenu
      position="left"
      items={menuItems}
      
      
      displayItemNumbering={true}
      menuButtonColor="#2C2C2C"
      openMenuButtonColor="#FAF8F3"
      changeMenuColorOnOpen={true}
      colors={['#5B7C4F', '#2C2C2C']}
      accentColor="#5B7C4F"
      isFixed={true}
      onMenuOpen={() => {}}
      onMenuClose={() => {}}
    />
  );
};

export default Header;
