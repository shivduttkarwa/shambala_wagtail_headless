import React, { useEffect, useRef } from "react";
import "./NewHeroSection.css";

import Swiper from "swiper";
import { Navigation, Pagination, Autoplay, EffectCreative, Mousewheel, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const NewHeroSection: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  let heroSwiper: Swiper | null = null;
  let fullscreenSwiper: Swiper | null = null;

  const openFullscreen = (slideIndex = 0) => {
    const fullscreenSlider = document.getElementById('fullscreenSlider');
    if (!fullscreenSlider) return;
    
    fullscreenSlider.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (!fullscreenSwiper) {
      fullscreenSwiper = new Swiper('.fullscreen-swiper', {
        modules: [Navigation, Pagination, EffectCreative, Mousewheel, Keyboard],
        loop: true,
        speed: 1400,
        effect: 'creative',
        creativeEffect: {
          prev: { translate: ['-100%', 0, 0], opacity: 0 },
          next: { translate: ['100%', 0, 0], opacity: 0 },
        },
        pagination: { el: '.fullscreen-pagination', type: 'fraction' },
        navigation: { 
          nextEl: '.fullscreen-next', 
          prevEl: '.fullscreen-prev' 
        },
        mousewheel: { 
          enabled: true, 
          forceToAxis: true, 
          sensitivity: 1, 
          releaseOnEdges: true, 
          thresholdDelta: 50 
        },
        keyboard: { enabled: true },
        on: {
          slideChange() {
            gsap.fromTo('.fullscreen-slide-content',
              { opacity: 0, y: 26 },
              { opacity: 1, y: 0, duration: .7, delay: .35, ease: 'power3.out' }
            );
          }
        }
      });
    }
    fullscreenSwiper.slideToLoop(slideIndex, 0);
  };

  const closeFullscreen = () => {
    const fullscreenSlider = document.getElementById('fullscreenSlider');
    if (!fullscreenSlider) return;
    
    fullscreenSlider.classList.remove('active');
    document.body.style.overflow = '';
  };

  useEffect(() => {
    // Initialize Swiper modules
    Swiper.use([Navigation, Pagination, Autoplay, EffectCreative, Mousewheel, Keyboard]);

    // HERO SWIPER
    heroSwiper = new Swiper('.heroSwiper', {
      loop: true,
      speed: 900,
      effect: 'creative',
      creativeEffect: {
        prev: { translate: ['-20%', 0, -1], opacity: 0 },
        next: { translate: ['100%', 0, 0], opacity: 0 },
      },
      pagination: { el: '.slider-container .swiper-pagination', type: 'fraction' },
      navigation: {
        nextEl: '#rs-next',
        prevEl: '#rs-prev',
      },
      autoplay: { delay: 5000, disableOnInteraction: false },
      on: {
        autoplayTimeLeft(swiper, _time, progress) {
          const activeSlide = swiper.slides[swiper.activeIndex] as HTMLElement;
          const bar = activeSlide?.querySelector('.slide-progress-fill') as HTMLElement;
          if (bar) bar.style.width = `${(1 - progress) * 100}%`;
        },
        slideChange() {
          document.querySelectorAll('.slide-progress-fill').forEach((b: Element) => {
            (b as HTMLElement).style.width = '0%';
          });
        }
      }
    });

    // Event listeners for fullscreen functionality
    document.querySelectorAll('.slide-wrapper').forEach((wrapper: Element) => {
      wrapper.addEventListener('click', (e) => {
        if ((e.target as Element).closest('a')) return;
        const idx = parseInt((wrapper as HTMLElement).dataset.slideIndex || '0', 10) || 0;
        openFullscreen(idx);
      });
    });

    // CTA opens fullscreen first slide
    const ctaLink = document.getElementById('ctaLink');
    const discoverBox = document.getElementById('discoverBox');
    const ctaHandler = (e: Event) => { e.preventDefault(); openFullscreen(0); };
    
    ctaLink?.addEventListener('click', ctaHandler);
    discoverBox?.addEventListener('click', ctaHandler);

    // Close fullscreen - get reference for cleanup
    let closeBtn: HTMLElement | null = null;
    setTimeout(() => {
      closeBtn = document.getElementById('closeFullscreen');
      closeBtn?.addEventListener('click', closeFullscreen);
    }, 100);
    
    const escHandler = (e: KeyboardEvent) => {
      const fullscreenSlider = document.getElementById('fullscreenSlider');
      if (e.key === 'Escape' && fullscreenSlider?.classList.contains('active')) {
        closeFullscreen();
      }
    };
    document.addEventListener('keydown', escHandler);

    // Entrance animations - with immediate fallback to visible state
    const tl = gsap.timeline();
    
    // Ensure elements are visible first, then animate from hidden state
    gsap.set('.hero-text h1, .discover-box, .slider-container', { 
      opacity: 1, 
      x: 0, 
      y: 0 
    });

    // Animate from hidden to visible state
    tl.fromTo('.hero-text h1', 
      { 
        y: 96, 
        opacity: 0 
      },
      { 
        duration: 1.05, 
        y: 0, 
        opacity: 1, 
        ease: 'power3.out', 
        delay: 0.2 
      }
    )
    .fromTo('.discover-box', 
      { 
        x: -60, 
        opacity: 0 
      },
      { 
        duration: 0.9, 
        x: 0, 
        opacity: 1, 
        ease: 'power3.out' 
      }, 
      "-=0.6"
    )
    .fromTo('.slider-container', 
      { 
        x: 60, 
        opacity: 0 
      },
      { 
        duration: 0.9, 
        x: 0, 
        opacity: 1, 
        ease: 'power3.out' 
      }, 
      "-=0.5"
    );

    // Safety fallback: ensure content is visible after a delay
    setTimeout(() => {
      const heroContent = document.querySelector('.hero-content');
      const heroText = document.querySelector('.hero-text h1');
      const discoverBox = document.querySelector('.discover-box');
      const sliderContainer = document.querySelector('.slider-container');
      
      if (heroContent) {
        gsap.set([heroText, discoverBox, sliderContainer], {
          opacity: 1,
          x: 0,
          y: 0,
          clearProps: "transform,opacity"
        });
      }
    }, 2000);

    // Subtle parallax on video
    const videoTween = gsap.to('.video-background', {
      scrollTrigger: { 
        trigger: '.hero-section', 
        start: 'top top', 
        end: 'bottom top', 
        scrub: 1 
      },
      scale: 1.12, 
      ease: 'none'
    });

    return () => {
      // Cleanup
      heroSwiper?.destroy(true, true);
      fullscreenSwiper?.destroy(true, true);
      
      ctaLink?.removeEventListener('click', ctaHandler);
      discoverBox?.removeEventListener('click', ctaHandler);
      
      // Get fresh reference for cleanup
      const closeBtnForCleanup = document.getElementById('closeFullscreen');
      closeBtnForCleanup?.removeEventListener('click', closeFullscreen);
      
      document.removeEventListener('keydown', escHandler);
      
      // Kill all GSAP animations and timelines
      tl?.kill();
      videoTween?.scrollTrigger?.kill();
      videoTween?.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <>
      <section ref={heroSectionRef} className="hero-section">
        <video className="video-background" autoPlay muted loop playsInline>
          <source src={`${import.meta.env.BASE_URL}images/3769953-hd_1920_1080_25fps.mp4`} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-text">
            <h1>Transform your<br/>outdoor dreams</h1>
          </div>

          <div className="hero-bottom">
            <div className="discover-box" id="discoverBox">
              <a href="#contact" className="cta-link" id="ctaLink">
                <span className="cta-text" data-text="Get a Free Site Visit">
                  <span>Get a Free Site Visit</span>
                </span>
                <span className="arrow">→</span>
              </a>
            </div>

            <div className="slider-container">
              <div className="c-carousel-news_controls">
                <button className="c-button -icon c-carousel_news_button -next" id="rs-next" aria-label="Next">
                  <span className="c-button_inner">
                    <span className="u-screen-reader-text">Next</span>
                    <span className="c-button_icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </span>
                </button>
                <button className="c-button -icon c-carousel_news_button -prev" id="rs-prev" aria-label="Previous">
                  <span className="c-button_inner">
                    <span className="u-screen-reader-text">Previous</span>
                    <span className="c-button_icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M16 4L8 12l8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </span>
                </button>
              </div>

              <div className="swiper heroSwiper">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="slide-wrapper" data-slide-index="0">
                      <img className="slide-image" src={`${import.meta.env.BASE_URL}images/1.jpg`} alt="Garden Design" loading="lazy"/>
                      <div className="slide-progress-bar"><div className="slide-progress-fill"></div></div>
                      <div className="slide-content">
                        <h3 className="slide-title">Garden Design & Installation</h3>
                        <a href="#" className="slide-link" onClick={(e) => e.stopPropagation()}>
                          Read more <span className="arrow">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="slide-wrapper" data-slide-index="1">
                      <img className="slide-image" src={`${import.meta.env.BASE_URL}images/2.jpg`} alt="Landscaping Project" loading="lazy"/>
                      <div className="slide-progress-bar"><div className="slide-progress-fill"></div></div>
                      <div className="slide-content">
                        <h3 className="slide-title">Outdoor Living Spaces</h3>
                        <a href="#" className="slide-link" onClick={(e) => e.stopPropagation()}>
                          Read more <span className="arrow">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="slide-wrapper" data-slide-index="2">
                      <img className="slide-image" src={`${import.meta.env.BASE_URL}images/3.jpg`} alt="Sustainable Landscaping" loading="lazy"/>
                      <div className="slide-progress-bar"><div className="slide-progress-fill"></div></div>
                      <div className="slide-content">
                        <h3 className="slide-title">Sustainable Eco-Friendly Gardens</h3>
                        <a href="#" className="slide-link" onClick={(e) => e.stopPropagation()}>
                          Read more <span className="arrow">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-pagination"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen overlay */}
      <div className="fullscreen-slider" id="fullscreenSlider">
        <button className="close-fullscreen" id="closeFullscreen">×</button>
        <div className="swiper fullscreen-swiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide fullscreen-slide">
              <img className="fullscreen-slide-image" src={`${import.meta.env.BASE_URL}images/l1.jpg`} alt="Garden Design" loading="eager"/>
              <div className="fullscreen-overlay"></div>
              <div className="fullscreen-slide-content">
                <h2>Garden Design & Installation</h2>
                <a className="slide-link" href="#"><span>Read more</span> <span className="arrow">→</span></a>
              </div>
            </div>
            <div className="swiper-slide fullscreen-slide">
              <img className="fullscreen-slide-image" src={`${import.meta.env.BASE_URL}images/l2.jpg`} alt="Landscaping Project" loading="eager"/>
              <div className="fullscreen-overlay"></div>
              <div className="fullscreen-slide-content">
                <h2>Outdoor Living Spaces</h2>
                <a className="slide-link" href="#"><span>Read more</span> <span className="arrow">→</span></a>
              </div>
            </div>
            <div className="swiper-slide fullscreen-slide">
              <img className="fullscreen-slide-image" src={`${import.meta.env.BASE_URL}images/l3.jpg`} alt="Sustainable Landscaping" loading="eager"/>
              <div className="fullscreen-overlay"></div>
              <div className="fullscreen-slide-content">
                <h2>Sustainable Eco-Friendly Gardens</h2>
                <a className="slide-link" href="#"><span>Read more</span> <span className="arrow">→</span></a>
              </div>
            </div>
          </div>
        </div>
        <div className="fullscreen-pagination"></div>
        <div className="fullscreen-nav">
          <button className="fullscreen-prev">‹</button>
          <button className="fullscreen-next">›</button>
        </div>
      </div>
    </>
  );
};

export default NewHeroSection;