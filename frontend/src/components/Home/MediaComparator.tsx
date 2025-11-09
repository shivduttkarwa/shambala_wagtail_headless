import React, { useEffect, useRef } from 'react';
import './MediaComparator.css';
import { gsap } from '../../lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface MediaComparatorProps {
  id: string;
  title?: string;
  subtitle?: string;
  slides: Slide[];
  direction?: 'rtl' | 'ltr';
  showComparatorLine?: boolean;
  showOverlayAnimation?: boolean;
}

const MediaComparator: React.FC<MediaComparatorProps> = ({
  id,
  title,
  subtitle,
  slides,
  direction = 'rtl',
  showComparatorLine = true,
  showOverlayAnimation = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const swiperWrapperRef = useRef<HTMLDivElement>(null);
  const publicUrl = import.meta.env.BASE_URL;

  const progressRef = useRef({ value: 0 });
  const lastProgressRef = useRef(0); // Store last progress position

  useEffect(() => {
    console.log('MediaComparator useEffect triggered for:', id, 'with', slides.length, 'slides');
    
    if (!containerRef.current || !wrapperRef.current || !swiperWrapperRef.current) {
      console.log('MediaComparator: Missing refs for', id);
      return;
    }

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const swiperWrapper = swiperWrapperRef.current;
    const slideElements = Array.from(swiperWrapper.children) as HTMLElement[];
    const numSlides = slideElements.length;
    
    console.log('MediaComparator setup for:', id, 'numSlides:', numSlides);

    // Cache slide inner elements
    slideElements.forEach(slide => {
      const slideInner = slide.querySelector('.slide-inner') as HTMLElement;
      const overlay = slide.querySelector('.media-overlay-stack') as HTMLElement;
      (slide as any).slideInner = slideInner;
      (slide as any).overlay = overlay;
    });

    // Calculate wrapper width for scroll distance
    const getWrapperWidth = () => {
      return swiperWrapper.offsetWidth * numSlides;
    };

    // Update slide positions based on progress
    const updateSlidePositions = (progress: number) => {
      progress = Math.max(0, Math.min(1, progress));

      // Reverse progress for LTR direction
      if (direction === 'ltr') {
        progress = 1 - progress;
      }

      // Calculate translation
      const wrapperWidth = swiperWrapper.offsetWidth;
      const maxTranslate = -(wrapperWidth * (numSlides - 1));
      const currentTranslate = maxTranslate * progress;

      // Apply translation
      gsap.set(swiperWrapper, {
        x: currentTranslate,
        force3D: true, // Force GPU acceleration
        willChange: 'transform'
      });

      // Update in-progress state for comparator line
      const inProgress = progress > 0 && progress < 1;
      if (inProgress) {
        swiperWrapper.classList.add('in-progress');
      } else {
        swiperWrapper.classList.remove('in-progress');
      }

      // Update each slide's parallax effect with mobile optimization
      const interleaveOffset = isMobile ? 0.3 : 0.5; // Reduce parallax on mobile
      const interleaveOverlayOffset = isMobile ? 0.7 : 0.9; // Reduce overlay movement on mobile
      
      slideElements.forEach((slide, index) => {
        const slideProgress = progress * (numSlides - 1) - index;
        const clampedProgress = Math.max(-1, Math.min(1, slideProgress));
        
        const slideInner = (slide as any).slideInner;
        const overlay = (slide as any).overlay;

        if (slideInner) {
          const innerTranslate = clampedProgress * wrapperWidth * interleaveOffset;
          gsap.set(slideInner, {
            x: innerTranslate,
            force3D: true,
            willChange: isMobile ? 'transform' : 'auto'
          });
        }

        if (overlay && showOverlayAnimation) {
          const absProgress = Math.abs(clampedProgress);
          const overlayTranslate = clampedProgress * 100 * interleaveOverlayOffset;
          const opacity = 1 - absProgress;
          
          gsap.set(overlay, {
            x: `${overlayTranslate}%`,
            opacity: opacity,
            force3D: true,
            willChange: isMobile ? 'transform, opacity' : 'auto'
          });
        }
      });
    };

    // Detect mobile for optimized settings
    const isMobile = window.innerWidth <= 768;
    
    // Add delay to ensure proper initialization
    const initDelay = setTimeout(() => {
      console.log('Initializing ScrollTrigger for:', id);
      
      // Create ScrollTrigger animation with mobile optimizations
      const animation = gsap.to(progressRef.current, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        pin: container,
        pinSpacing: true,
        scrub: isMobile ? 0.1 : 0.25, // Much lighter scrub on mobile
        anticipatePin: isMobile ? 0 : 1, // Disable anticipatePin on mobile
        start: 'center center',
        end: () => `+=${getWrapperWidth()}`,
        invalidateOnRefresh: true,
        fastScrollEnd: isMobile ? true : false, // Prevent flicker on mobile
        onUpdate: (self) => {
          // Store the current progress
          lastProgressRef.current = self.progress;
          
          if (isMobile) {
            // Throttle updates on mobile to prevent stagger
            requestAnimationFrame(() => {
              updateSlidePositions(self.progress);
            });
          } else {
            updateSlidePositions(self.progress);
          }
        },
        onRefresh: () => {
          // Use stored position if available, otherwise use current progress
          const positionToUse = lastProgressRef.current || progressRef.current.value;
          updateSlidePositions(positionToUse);
        },
        onEnter: () => {
          // Restore last position when re-entering
          if (lastProgressRef.current > 0) {
            // Force the ScrollTrigger to use our stored position
            gsap.set(progressRef.current, { value: lastProgressRef.current });
            updateSlidePositions(lastProgressRef.current);
          }
        },
        onLeave: (self) => {
          // Store position when leaving
          lastProgressRef.current = self.progress;
        },
        onToggle: (self) => {
          // Store position when leaving, restore when entering
          if (self.isActive) {
            // Entering: restore last position
            if (lastProgressRef.current > 0) {
              progressRef.current.value = lastProgressRef.current;
              updateSlidePositions(lastProgressRef.current);
            }
          } else {
            // Leaving: store current position
            lastProgressRef.current = self.progress;
          }
        }
      }
    });

      
      // Initialize at starting position (or restore last position)
      const initialProgress = lastProgressRef.current || 0;
      updateSlidePositions(initialProgress);

      return () => {
        animation.kill();
      };
    }, 200); // 200ms delay

    return () => {
      clearTimeout(initDelay);
    };
  }, [slides, direction, showOverlayAnimation]);

  return (
    <div 
      id={id}
      ref={containerRef}
      className={`media-comparator ${direction === 'rtl' ? 'scrub-rtl' : 'scrub-ltr'}`}
      data-scrub="true"
      data-comparator-line={showComparatorLine ? 'true' : 'false'}
      data-swiper-dir={direction === 'rtl' ? '1' : '-1'}
    >
      {title && (
        <div className="dummy-block">
          <div className="text-container">
            <h2 style={{ textAlign: 'center' }}>
              {title}
            </h2>
            {subtitle && <p>{subtitle}</p>}
            <h3>Scroll Down<br/>↓</h3>
          </div>
        </div>
      )}
      <div className="container">
        <div className="wrapper wrapper-xl" ref={wrapperRef}>
          <div className="swiper-container">
            <div className="swiper-wrapper" ref={swiperWrapperRef}>
              {slides.map((slide, index) => (
                <div key={index} className="swiper-slide">
                  <div className="slide-inner">
                    <div className="stack-container media-container">
                      {
                        (() => {
                          const raw = slide.image || '';
                          // Leave absolute and leading-root paths unchanged to avoid
                          // interfering with other layout logic that expects '/images/*'.
                          if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('/')) {
                            return (
                              <img
                                className="fit-cover middle-center"
                                src={raw}
                                alt={slide.title}
                                draggable="false"
                              />
                            );
                          }

                          // Otherwise prefix with PUBLIC_URL so relative paths resolve
                          // correctly both in dev and when served under a repo subpath.
                          const imgSrc = `${publicUrl}/${raw.replace(/^\/+/, '')}`;
                          return (
                            <img
                              className="fit-cover middle-center"
                              src={imgSrc}
                              alt={slide.title}
                              draggable="false"
                            />
                          );
                        })()
                      }
                      <div className="media-overlay-stack">
                        <div className="wrapper wrapper-xl">
                          <div className="text-container">
                            <h2 className="slide-title" style={{ textAlign: 'center' }}>
                              {slide.title}
                            </h2>
                            <p>{slide.subtitle}</p>
                            {slide.buttonText && slide.buttonUrl && (
                              <a href={slide.buttonUrl} className="cta-button">
                                <span className="text">{slide.buttonText}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaComparator;
