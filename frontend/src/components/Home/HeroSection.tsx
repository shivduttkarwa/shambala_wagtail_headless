import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import SliderModal from './SliderModal';
import { LazyImage } from '@/components/LazyImage';

interface ServiceBox {
  id: number;
  index: number;
  title: string;
  description: string;
  image: string;
  imageSmall?: string;
  fullImage?: string;
}

interface HeroSectionProps {
  mainTitle?: string[];
  typedTexts?: string[];
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  serviceBoxes?: ServiceBox[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  mainTitle = ['we', 'make'],
  typedTexts = [
    'eco-friendly outdoors',
    'self-sustaining gardens',
    'relaxing spaces',
    'beautiful landscapes'
  ],
  ctaText = 'Get a Free Site Visit',
  ctaLink = '#contact',
  backgroundImage = `${import.meta.env.BASE_URL}images/12.jpg`,
  serviceBoxes = []
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const bookLinkRef = useRef<HTMLAnchorElement>(null);
  const mainGridRef = useRef<HTMLDivElement>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Preload full resolution images for smooth slider experience
  useEffect(() => {
    serviceBoxes.forEach((box) => {
      if (box.fullImage) {
        const img = new Image();
        img.src = box.fullImage;
      }
    });
  }, [serviceBoxes]);

  // Animation state refs
  const currentIndexRef = useRef(0);
  const currentBricksRef = useRef<HTMLDivElement[]>([]);
  const brickWallBuiltRef = useRef(false);

  useEffect(() => {
    // Force scroll to top
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (!h1Ref.current || !textRef.current) return;

    const h1Element = h1Ref.current;
    const container = textRef.current;

    // Set initial states - prepare for animation
    const spans = h1Element.querySelectorAll('.d-flex span');
    gsap.set(spans, { y: '100%' }); // Start below
    gsap.set(container, { y: 0, opacity: 0 }); // Start hidden
    container.textContent = ''; // Start empty

    // Create bricks
    const createBricks = () => {
      const bricks: HTMLDivElement[] = [];
      const h1Rect = h1Element.getBoundingClientRect();
      
      const brickHeight = 35;
      const brickWidth = 85;
      const bricksPerRow = Math.ceil(h1Rect.width / brickWidth) + 2;
      const rows = Math.ceil(h1Rect.height / brickHeight) + 1;
      
      for (let row = 0; row < rows; row++) {
        const isEvenRow = row % 2 === 0;
        const offsetX = isEvenRow ? 0 : -brickWidth / 2;
        
        for (let col = 0; col < bricksPerRow; col++) {
          const brick = document.createElement('div');
          brick.className = 'brick';
          brick.style.cssText = `
            position: absolute;
            background: rgba(250,248,243,.95);
            border: 0.5px solid rgba(91,124,79,.15);
            box-shadow: inset 0 0 15px rgba(91,124,79,.1);
            box-sizing: border-box;
            z-index: -1;
            width: ${brickWidth}px;
            height: ${brickHeight}px;
            left: ${offsetX + col * brickWidth}px;
            top: ${row * brickHeight}px;
          `;
          h1Element.appendChild(brick);
          bricks.push(brick);
        }
      }
      
      return bricks;
    };

    // Clear old bricks
    const clearOldBricks = () => {
      currentBricksRef.current.forEach(brick => brick.remove());
      currentBricksRef.current = [];
    };

    // Animate bricks assembly
    const animateBricksAssembly = (callback: () => void) => {
      clearOldBricks();
      
      const bricks = createBricks();
      currentBricksRef.current = bricks;
      const triggerPoint = Math.floor(bricks.length * 0.5);
      
      bricks.forEach((brick, i) => {
        const fromSide = Math.floor(Math.random() * 4);
        let startX = 0, startY = 0;
        
        switch(fromSide) {
          case 0: // from top
            startX = (Math.random() - 0.5) * 600;
            startY = -1000 - Math.random() * 400;
            break;
          case 1: // from right
            startX = 1000 + Math.random() * 400;
            startY = (Math.random() - 0.5) * 600;
            break;
          case 2: // from bottom
            startX = (Math.random() - 0.5) * 600;
            startY = 1000 + Math.random() * 400;
            break;
          case 3: // from left
            startX = -1000 - Math.random() * 400;
            startY = (Math.random() - 0.5) * 600;
            break;
        }
        
        const startRotation = Math.random() * 720 - 360;
        
        gsap.set(brick, {
          x: startX,
          y: startY,
          rotation: startRotation,
          opacity: 0,
          scale: 0.5
        });
        
        gsap.to(brick, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: i * 0.018,
          ease: 'back.out(1.2)',
          onComplete: () => {
            if (i === triggerPoint) {
              callback();
            }
            if (i === bricks.length - 1) {
              brickWallBuiltRef.current = true;
            }
          }
        });
      });
    };

    // Animate "Hero Title" text
    const animateWeMakeSimple = (callback: () => void) => {
      const spans = h1Element.querySelectorAll('.d-flex span');
      gsap.to(spans, {
        duration: 0.8,
        y: '0%',
        stagger: 0.2,
        ease: 'power2.out',
        onComplete: callback
      });
    };

    // Animate text with elegant letter-by-letter reveal
    const animateTextSimple = () => {
      if (!textRef.current) return;
      
      const text = typedTexts[currentIndexRef.current];
      container.textContent = '';
      container.style.opacity = '1';
      
      // Create individual letter spans
      const letters = text.split('').map((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        container.appendChild(span);
        return span;
      });
      
      // Animate letters one by one with elegant fade and slight lift
      gsap.fromTo(letters,
        { 
          opacity: 0,
          y: 20,
          rotateX: -90
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.03,
        }
      );
    };

    // Show line
    const showLine = () => {
      animateBricksAssembly(() => {
        animateWeMakeSimple(() => {
          animateTextSimple();
        });
      });
    };

    // Fallback: Ensure text is visible after 3 seconds if animation fails
    const fallbackTimer = setTimeout(() => {
      const spans = h1Element.querySelectorAll('.d-flex span');
      gsap.set(spans, { y: '0%' });
      gsap.set(container, { y: 0, opacity: 1 });
      if (!container.textContent) {
        container.textContent = typedTexts[0];
      }
    }, 3000);

    // ScrollTrigger setup
    ScrollTrigger.create({
      trigger: h1Element,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        clearTimeout(fallbackTimer); // Clear fallback if animation starts
        showLine();
      },
      onLeave: () => {
        // Kill ongoing text animations
        gsap.killTweensOf(container);
      },
      onEnterBack: () => {
        // Immediately kill all ongoing animations
        gsap.killTweensOf(container);
        const spans = h1Element.querySelectorAll('.d-flex span');
        gsap.killTweensOf(spans);
        
        // Immediately hide everything
        container.textContent = '';
        gsap.set(container, { y: 30, opacity: 0, clearProps: 'all' });
        gsap.set(spans, { y: '100%', clearProps: 'transform' });
        
        // Reset all state
        brickWallBuiltRef.current = false;
        currentIndexRef.current = 0;
        
        // Start animation after a brief delay to ensure everything is reset
        setTimeout(() => {
          showLine();
        }, 50);
      },
      onLeaveBack: () => {
        // Kill all animations immediately
        gsap.killTweensOf(container);
        const spans = h1Element.querySelectorAll('.d-flex span');
        gsap.killTweensOf(spans);
        
        // Hide everything
        container.textContent = '';
        gsap.set(container, { y: 30, opacity: 0, clearProps: 'all' });
        gsap.set(spans, { y: '100%', clearProps: 'transform' });
        
        // Clear bricks
        clearOldBricks();
      }
    });

    // Initial animation on page load
    showLine();

    // Strong fallback: Ensure text is visible after animation should complete
    setTimeout(() => {
      if (!brickWallBuiltRef.current) {
        // If bricks aren't built yet, force show text
        const spans = h1Element.querySelectorAll('.d-flex span');
        gsap.set(spans, { y: '0%' });
        gsap.set(container, { y: 0, opacity: 1 });
        if (!container.textContent) {
          container.textContent = typedTexts[0];
        }
      }
    }, 2000); // Wait 2 seconds for animation to complete

    // Set up text cycling animation
    const cycleText = () => {
      if (!textRef.current || isPaused) return;
      
      const container = textRef.current;
      const nextIndex = (currentIndexRef.current + 1) % typedTexts.length;
      const nextText = typedTexts[nextIndex];
      
      // Slide out current text
      gsap.to(container, {
        x: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          // Update text content
          container.textContent = '';
          
          // Create new letter spans
          const letters = nextText.split('').map((char) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateX(50px)';
            container.appendChild(span);
            return span;
          });
          
          // Update current index
          currentIndexRef.current = nextIndex;
          
          // Slide in new text
          gsap.set(container, { x: 50, opacity: 0 });
          gsap.to(container, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              // Animate letters
              gsap.to(letters, {
                x: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.02,
                ease: 'power2.out'
              });
            }
          });
        }
      });
    };

    // Start cycling after initial animation
    const cycleInterval = setInterval(cycleText, 3000); // Change every 3 seconds

    return () => {
      // Only kill ScrollTriggers that belong to this component
      ScrollTrigger.getAll().filter(trigger => 
        trigger.trigger === h1Element
      ).forEach(trigger => trigger.kill());
      clearOldBricks();
      clearInterval(cycleInterval);
      clearTimeout(fallbackTimer);
    };
  }, [typedTexts, isPaused]);

  // Handle pause/resume of text cycling
  useEffect(() => {
    if (isPaused) {
      // Pause any ongoing animations
      if (textRef.current) {
        gsap.killTweensOf(textRef.current);
      }
    }
  }, [isPaused]);

  useEffect(() => {
    // Animate CTA button text
    if (bookLinkRef.current) {
      const linkTextSpan = bookLinkRef.current.querySelector('.linktext');
      if (linkTextSpan) {
        const linkText = linkTextSpan.textContent || '';
        linkTextSpan.innerHTML = '';
        linkText.split('').forEach((char) => {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = char;
          linkTextSpan.appendChild(span);
        });
      }
    }
  }, [ctaText]);

  const handleBoxClick = (index: number) => {
    setSelectedBoxIndex(index);
    setIsSliderOpen(true);
    setIsPaused(true);
  };

  const handleCloseSlider = () => {
    setIsSliderOpen(false);
    setIsPaused(false);
  };

  

  return (
    <>
      <section
        className="info-section"
        id="home"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="left-part">
          <h1 ref={h1Ref}>
            <div className="d-flex-wrapper">
              {mainTitle.map((word, index) => (
                <div key={index} className="d-flex">
                  <span>{word}</span>
                </div>
              ))}
            </div>
            <span className="text changing-text" ref={textRef}></span>
          </h1>
          <a
            href={ctaLink}
            className="book-link"
            ref={bookLinkRef}
            
          >
            <span className="linktext">{ctaText}</span>
            <span className="arrow"></span>
          </a>
        </div>

        <div className="right-part">
          <div
            className={`main-grid d-flex ${isPaused ? 'paused' : ''}`}
            ref={mainGridRef}
          >
            {serviceBoxes.map((box) => (
              <div
                key={box.id}
                className="box"
                data-index={box.index}
                onClick={() => handleBoxClick(box.index)}
              >
                <div className="bg-img">
                  <LazyImage
                   src={box.image}
                   placeholder={box.imageSmall}
                   alt={box.title}
                   className="..."
                               />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SliderModal
        isOpen={isSliderOpen}
        onClose={handleCloseSlider}
        serviceBoxes={serviceBoxes}
        initialSlide={selectedBoxIndex}
      />
    </>
  );
};

export default HeroSection;
