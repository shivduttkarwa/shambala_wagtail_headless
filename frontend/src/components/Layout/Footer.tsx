import React from 'react';
import './Footer.css';
import { SiteSettings } from '../../services/api';

interface FooterProps {
  settings: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  const publicUrl = import.meta.env.BASE_URL;

  return (
    <footer className="footer" style={{ backgroundImage: `url(${publicUrl}images/footer.jpg)` }}>
      {/* Abstract Architectural Background */}
      <div className="footer-background">
        <div className="arch-pattern arch-pattern-1"></div>
        <div className="arch-pattern arch-pattern-2"></div>
        <div className="arch-pattern arch-pattern-3"></div>
        <div className="arch-lines">
          <div className="arch-line arch-line-1"></div>
          <div className="arch-line arch-line-2"></div>
          <div className="arch-line arch-line-3"></div>
          <div className="arch-line arch-line-4"></div>
        </div>
        {/* Abstract Background Element */}
  <div className="footer-abstract-bg" style={{ backgroundImage: `url(${publicUrl}images/footer-bg.jpg)` }}></div>
      </div>

      <div className="footer-content">
        <div className="footer-container">
          {/* Footer Top Section */}
          <div className="footer-top">
            <div className="footer-column footer-brand">
              <h3 className="footer-logo">{settings?.header?.logo_text || 'Shambala Homes'}</h3>
              <p className="footer-tagline">
                Creating timeless outdoor spaces that blend natural beauty with sophisticated design.
              </p>
              {/* Social Media Links from Settings */}
              <div className="footer-social">
                {settings?.social?.facebook && (
                  <a href={settings.social.facebook} className="social-link facebook" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <span className="social-icon">f</span>
                  </a>
                )}
                {settings?.social?.instagram && (
                  <a href={settings.social.instagram} className="social-link instagram" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <span className="social-icon">ig</span>
                  </a>
                )}
                {settings?.social?.linkedin && (
                  <a href={settings.social.linkedin} className="social-link linkedin" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <span className="social-icon">in</span>
                  </a>
                )}
                {settings?.social?.twitter && (
                  <a href={settings.social.twitter} className="social-link twitter" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                    <span className="social-icon">tw</span>
                  </a>
                )}
                {settings?.social?.youtube && (
                  <a href={settings.social.youtube} className="social-link youtube" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                    <span className="social-icon">yt</span>
                  </a>
                )}
              </div>
            </div>

            {/* Dynamic Footer Columns from Settings */}
            {settings?.footer?.sections?.map((section, idx) => {
              if (section.type === 'columns' && section.columns) {
                return section.columns.map((column, colIdx) => (
                  <div key={`${idx}-${colIdx}`} className="footer-column">
                    <h4 className="footer-title">{column.heading}</h4>
                    <ul className="footer-links">
                      {column.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <a href={link.link}>{link.text}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ));
              }
              
              if (section.type === 'contact' && section.contact) {
                return (
                  <div key={idx} className="footer-column">
                    <h4 className="footer-title">Contact</h4>
                    <ul className="footer-contact">
                      {section.contact.show_address && settings.contact.address && (
                        <li>
                          <span className="contact-label">Address:</span>
                          <span dangerouslySetInnerHTML={{ __html: settings.contact.address.replace(/\n/g, '<br/>') }} />
                        </li>
                      )}
                      {section.contact.show_phone && settings.contact.phone && (
                        <li>
                          <span className="contact-label">Phone:</span>
                          <span>{settings.contact.phone}</span>
                        </li>
                      )}
                      {section.contact.show_email && settings.contact.email && (
                        <li>
                          <span className="contact-label">Email:</span>
                          <span>{settings.contact.email}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              }
              
              return null;
            })}

            {/* Fallback Footer Columns if no settings */}
            {(!settings?.footer?.sections || settings.footer.sections.length === 0) && (
              <>
                <div className="footer-column">
                  <h4 className="footer-title">Services</h4>
                  <ul className="footer-links">
                    <li><a href={`${publicUrl}/services/garden-design`}>Garden Design</a></li>
                    <li><a href={`${publicUrl}/services/landscape-architecture`}>Landscape Architecture</a></li>
                    <li><a href={`${publicUrl}/services/outdoor-living`}>Outdoor Living Spaces</a></li>
                    <li><a href={`${publicUrl}/services/sustainable-gardens`}>Sustainable Gardens</a></li>
                    <li><a href={`${publicUrl}/services/water-features`}>Water Features</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4 className="footer-title">Company</h4>
                  <ul className="footer-links">
                    <li><a href={`${publicUrl}/about`}>About Us</a></li>
                    <li><a href={`${publicUrl}/portfolio`}>Our Portfolio</a></li>
                    <li><a href={`${publicUrl}/testimonials`}>Testimonials</a></li>
                    <li><a href={`${publicUrl}/careers`}>Careers</a></li>
                    <li><a href={`${publicUrl}/blog`}>Blog</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4 className="footer-title">Contact</h4>
                  <ul className="footer-contact">
                    <li>
                      <span className="contact-label">Address:</span>
                      <span>123 Garden Street<br/>Melbourne, VIC 3000</span>
                    </li>
                    <li>
                      <span className="contact-label">Phone:</span>
                      <span>+61 3 1234 5678</span>
                    </li>
                    <li>
                      <span className="contact-label">Email:</span>
                      <span>info@shambalahomes.com</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Footer Bottom Section */}
          <div className="footer-bottom">
            <div className="footer-divider"></div>
            <div className="footer-copyright">
              {/* Use copyright from settings or fallback */}
              {settings?.footer?.copyright ? (
                <div dangerouslySetInnerHTML={{ __html: settings.footer.copyright }} />
              ) : (
                <p>&copy; {new Date().getFullYear()} Shambala Homes. All rights reserved.</p>
              )}
              <div className="footer-legal">
                <a href={`${publicUrl}/privacy`}>Privacy Policy</a>
                <span className="separator">|</span>
                <a href={`${publicUrl}/terms`}>Terms of Service</a>
                <span className="separator">|</span>
                <a href={`${publicUrl}/cookies`}>Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
