import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import './FullPageMenu.css';

interface FullPageMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const FullPageMenu: React.FC<FullPageMenuProps> = ({ isOpen, onToggle }) => {
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const bgImgsRef = useRef<HTMLImageElement[]>([]);
  const itemsRef = useRef<HTMLLIElement[]>([]);
  
  // Use the same base URL pattern as other components
  const publicUrl = import.meta.env.BASE_URL || '/';

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      onToggle(); // Close menu first
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Wait for menu close animation
    }
  };

  useEffect(() => {
    if (!menuOverlayRef.current) return;

    const menuOverlay = menuOverlayRef.current;
    const pageContent = document.querySelector('.page-content') as HTMLElement;
    const bgImgs = bgImgsRef.current;
    const items = itemsRef.current;

    // Initialize GSAP timeline
    const menuTimeline = gsap.timeline({ paused: true });
    menuTimelineRef.current = menuTimeline;

    // Show first image by default
    if (bgImgs[0]) {
      gsap.set(bgImgs[0], { opacity: 1 });
    }

    // Setup hover effects for menu items
    const cleanupFunctions: (() => void)[] = [];
    
    items.forEach((item, index) => {
      const handleMouseEnter = () => {
        // Fade out all images
        gsap.to(bgImgs, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut"
        });

        // Fade in corresponding image
        if (bgImgs[index + 1]) {
          gsap.to(bgImgs[index + 1], {
            opacity: 1,
            scale: 1.18,
            duration: 0.5,
            ease: "power3.inOut"
          });
        }
      };

      const handleMouseLeave = () => {
        // Reset to default (first image)
        gsap.to(bgImgs, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          scale: 1
        });
        if (bgImgs[0]) {
          gsap.to(bgImgs[0], {
            opacity: 1,
            duration: 0.5,
            ease: "power3.inOut"
          });
        }
      };

      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);

      // Store cleanup function
      cleanupFunctions.push(() => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      });
    });

    // Setup timeline animations
    menuTimeline
      // Animate menu overlay clip-path open
      .to(
        menuOverlay,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 120%, 0% 100%)",
          duration: 0.8,
          ease: "power3.inOut",
          onStart: () => {
            menuOverlay.style.pointerEvents = "none";
          },
          onComplete: () => {
            menuOverlay.style.clipPath = "none";
            menuOverlay.style.pointerEvents = "auto";
          }
        },
        0
      );

    // Animate page content if it exists
    if (pageContent) {
      menuTimeline.to(
        pageContent,
        {
          yPercent: 20,
          rotation: 18,
          scale: 1.3,
          transformOrigin: "left top",
          duration: 0.8,
          ease: "power3.inOut"
        },
        0
      );
    }

    // Animate background zoom
    menuTimeline.to(
      ".menu-overlay__bg-img img",
      {
        scale: 1.1,
        duration: 1,
        ease: "power3.inOut"
      },
      0
    );

    // Animate menu links in
    menuTimeline.add(() => {
      const linkTexts = document.querySelectorAll("[data-text-anim]");
      
      linkTexts.forEach((el) => {
        gsap.set(el, { visibility: "visible" });
        
        // Simple character animation without SplitText dependency
        const chars = el.textContent?.split('') || [];
        el.innerHTML = chars.map(char => `<span class="char">${char}</span>`).join('');
        
        const charElements = el.querySelectorAll('.char');
        
        menuTimeline.fromTo(
          charElements,
          { yPercent: -200 },
          { yPercent: 0, ease: "power2.inOut", duration: 0.5, stagger: 0.01 },
          0.2
        );
      });
    }, 0);

    // Animate toggle button
    menuTimeline.to(
      ".toggle-line-top",
      {
        transformOrigin: "center",
        y: 4,
        scaleX: 0.8,
        rotation: 45,
        duration: 0.4,
        ease: "back.out(1.5)"
      },
      0.2
    );

    menuTimeline.to(
      ".toggle-line-bottom",
      {
        transformOrigin: "center",
        y: -4,
        scaleX: 0.8,
        rotation: -45,
        duration: 0.4,
        ease: "back.out(1.5)"
      },
      0.2
    );

    return () => {
      menuTimeline.kill();
      // Run all cleanup functions
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, []);

  // Handle menu toggle
  useEffect(() => {
    const menuTimeline = menuTimelineRef.current;
    if (!menuTimeline) return;

    if (isOpen) {
      menuTimeline.play();
    } else {
      menuTimeline.reverse();
      menuTimeline.eventCallback("onReverseComplete", () => {
        if (menuOverlayRef.current) {
          menuOverlayRef.current.style.pointerEvents = "none";
        }
      });
    }
  }, [isOpen]);

  return (
    <>
      <div className="menu-overlay" ref={menuOverlayRef}>
        <div className="menu-overlay__bg-container" aria-hidden="true">
          <div className="menu-overlay__bg-img">
            <img 
              ref={(el) => { if (el) bgImgsRef.current[0] = el; }}
              src={`${publicUrl}images/hero.jpg`} 
              data-bg-for="default" 
              alt="" 
            />
          </div>
          <div className="menu-overlay__bg-img">
            <img 
              ref={(el) => { if (el) bgImgsRef.current[1] = el; }}
              src={`${publicUrl}images/l1.jpg`} 
              data-bg-for="home" 
              alt="" 
            />
          </div>
          <div className="menu-overlay__bg-img">
            <img 
              ref={(el) => { if (el) bgImgsRef.current[2] = el; }}
              src={`${publicUrl}images/l2.jpg`} 
              data-bg-for="about" 
              alt="" 
            />
          </div>
          <div className="menu-overlay__bg-img">
            <img 
              ref={(el) => { if (el) bgImgsRef.current[3] = el; }}
              src={`${publicUrl}images/l3.jpg`} 
              data-bg-for="gallery" 
              alt="" 
            />
          </div>
          <div className="menu-overlay__bg-img">
            <img 
              ref={(el) => { if (el) bgImgsRef.current[4] = el; }}
              src={`${publicUrl}images/l4.jpg`} 
              data-bg-for="services" 
              alt="" 
            />
          </div>
          <div className="menu-overlay__bg-img">
            <img 
              ref={(el) => { if (el) bgImgsRef.current[5] = el; }}
              src={`${publicUrl}images/l5.jpg`} 
              data-bg-for="contact" 
              alt="" 
            />
          </div>
        </div>

        <div className="menu-overlay__content">
          <div className="menu-overlay__links">
            <div className="menu-overlay__main">
              <ul>
                <li ref={(el) => { if (el) itemsRef.current[0] = el; }}>
                  <a href="#home" data-text-anim onClick={handleMenuClick}>HOME</a>
                </li>
                <li ref={(el) => { if (el) itemsRef.current[1] = el; }}>
                  <a href="#about" data-text-anim onClick={handleMenuClick}>ABOUT</a>
                </li>
                <li ref={(el) => { if (el) itemsRef.current[2] = el; }}>
                  <a href="#gallery" data-text-anim onClick={handleMenuClick}>GALLERY</a>
                </li>
                <li ref={(el) => { if (el) itemsRef.current[3] = el; }}>
                  <a href="#services" data-text-anim onClick={handleMenuClick}>SERVICES</a>
                </li>
                <li ref={(el) => { if (el) itemsRef.current[4] = el; }}>
                  <a href="#contact" data-text-anim onClick={handleMenuClick}>CONTACT</a>
                </li>
              </ul>
            </div>
            <div className="menu-overlay__socials">
              <ul>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <header className="navbar">
        <nav className="wrapper">
          <div className="menu-bar">
            <div className="logo-wrapper">
              {/* Logo removed */}
            </div>
            <button className="navbar__menu" id="menu-toggle" onClick={onToggle} type="button">
              <span className="toggle-line-top"></span>
              <span className="toggle-line-bottom"></span>
            </button>
            <a href="#contact" className="navbar__btn btn">
              <span className="btn-txt">GET QUOTE</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" fill="none">
                <path fill="var(--text)" d="m17.76 6.857-5.727-5.688a.821.821 0 0 0-1.147.01.81.81 0 0 0-.01 1.139l4.33 4.3H.819a.821.821 0 0 0-.578.238.81.81 0 0 0 .578 1.388h14.389l-4.33 4.3a.813.813 0 0 0-.19.892.813.813 0 0 0 .765.505.824.824 0 0 0 .581-.248l5.727-5.688a.81.81 0 0 0 0-1.148Z" />
              </svg>
            </a>
          </div>
        </nav>
      </header>
    </>
  );
};

export default FullPageMenu;