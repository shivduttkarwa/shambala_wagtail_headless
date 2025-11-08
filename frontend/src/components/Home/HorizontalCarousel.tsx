import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './HorizontalCarousel.css';

interface SlideData {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
}

interface HorizontalCarouselProps {
  title?: string;
  slides?: SlideData[];
}

const publicUrl = import.meta.env.BASE_URL;

const defaultSlides: SlideData[] = [
  {
    id: 1,
    title: 'Garden Design',
    description: 'Transform your outdoor space with professional landscaping services tailored to your vision.',
    image: `${publicUrl}images/1.jpg`,
    link: '#'
  },
  {
    id: 2,
    title: 'Lawn Care',
    description: 'Keep your lawn healthy and vibrant year-round with our expert maintenance programs.',
    image: `${publicUrl}images/2.jpg`,
    link: '#'
  },
  {
    id: 3,
    title: 'Tree Services',
    description: 'Expert tree trimming, removal, and maintenance for the safety and beauty of your property.',
    image: `${publicUrl}images/3.jpg`,
    link: '#'
  },
  {
    id: 4,
    title: 'Irrigation Systems',
    description: 'Smart water systems for efficient garden care that saves water and maintains beauty.',
    image: `${publicUrl}images/4.jpg`,
    link: '#'
  },
  {
    id: 5,
    title: 'Hardscaping',
    description: 'Beautiful patios, walkways, and outdoor structures that enhance your living space.',
    image: `${publicUrl}images/5.jpg`,
    link: '#'
  },
  {
    id: 6,
    title: 'Outdoor Lighting',
    description: 'Illuminate your landscape with elegant lighting solutions for evening beauty.',
    image: `${publicUrl}images/6.jpg`,
    link: '#'
  }
];

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  title = 'Our Premium Services',
  slides = defaultSlides
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const swiperEl = section.querySelector('.swiper-container') as HTMLElement;
    if (!swiperEl) return;

    // Initialize Swiper only
    const swiper = new Swiper(swiperEl, {
      modules: [Pagination],
      slidesPerView: 'auto',
      spaceBetween: 24,
      centeredSlides: false,
      grabCursor: true,
      allowTouchMove: true,
      freeMode: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          spaceBetween: 24,
          slidesPerView: 2.5,
        },
        1024: {
          spaceBetween: 24,
          slidesPerView: 3,
        },
        1200: {
          spaceBetween: 24,
          slidesPerView: 3.5,
        }
      }
    });

    // Cleanup
    return () => {
      if (swiper) {
        swiper.destroy(true, true);
      }
    };
  }, [slides]);

  return (
    <div className="horizontal-carousel" ref={sectionRef} data-scrub="true">
      <div className="wrapper">
        <div className="text-before">
          <h2>{title}</h2>
        </div>
        <div className="swiper-container">
          <div className="swiper-column-gap"></div>
          <div className="swiper-wrapper">
            {slides.map((slide) => (
              <div key={slide.id} className="swiper-slide">
                <div className="card">
                  <div className="media-container">
                    <picture>
                      <img
                        className="fit-cover middle-center"
                        src={slide.image}
                        width="1024"
                        height="1024"
                        alt={slide.title}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>
                  <div className="card-text">
                    <h3 className="title">{slide.title}</h3>
                    <p>{slide.description}</p>
                    {slide.link && (
                      <a href={slide.link} className="cta-button">
                        <span className="text">Learn More</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="swiper-pagination-container">
          <div className="swiper-pagination-wrapper">
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCarousel;
