import React, { useEffect, useRef, Component } from "react";
import "./NewHeroSection.css";
import { useNewHero } from "../../hooks/useHome";

import Swiper from "swiper";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCreative,
} from "swiper/modules";

// Register Swiper modules
Swiper.use([Navigation, Pagination, Autoplay, EffectCreative]);
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

// Error Boundary Component
class HeroErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("Hero section error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="hero-section">
          <div className="hero-loading">Loading hero content...</div>
        </section>
      );
    }

    return this.props.children;
  }
}

const NewHeroSectionContent: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const swiperRef = useRef<Swiper | null>(null);
  const { loading, heroData } = useNewHero();
  // Fullscreen functionality removed for simplicity

  useEffect(() => {
    // Skip if still loading data
    if (loading || !heroData) return;

    let isComponentMounted = true;

    // Fallback: Hide poster after maximum wait time to prevent indefinite loading
    const maxWaitTimer = setTimeout(() => {
      if (isComponentMounted) {
        const poster = document.querySelector(
          "#new-hero-section .video-poster"
        );
        if (poster && (poster as HTMLElement).style.opacity !== "0") {
          console.log("Fallback: hiding poster after max wait time");
          (poster as HTMLElement).style.opacity = "0";
        }
      }
    }, 10000); // Give Vimeo more time - 10 seconds max

    // Wait for content to be loaded and DOM to be ready
    const initializeSwiper = () => {
      if (!isComponentMounted) return;

      const swiperElement = document.querySelector(
        "#new-hero-section .heroSwiper"
      );
      const nextEl = document.querySelector("#new-hero-section #rs-next");
      const prevEl = document.querySelector("#new-hero-section #rs-prev");

      console.log("Swiper init check:", {
        swiperElement,
        nextEl,
        prevEl,
        existing: swiperRef.current,
      });

      if (!swiperElement || swiperRef.current) return;

      // Check if we have slides
      const slides = swiperElement.querySelectorAll(".swiper-slide");
      console.log("Found slides:", slides.length);

      if (slides.length === 0) {
        console.warn("No slides found for Swiper");
        return;
      }

      try {
        // HERO SWIPER - use specific selector
        swiperRef.current = new Swiper("#new-hero-section .heroSwiper", {
          loop: slides.length > 1, // Only loop if we have multiple slides
          speed: 900,
          effect: "creative",
          creativeEffect: {
            prev: { translate: ["-20%", 0, -1], opacity: 0 },
            next: { translate: ["100%", 0, 0], opacity: 0 },
          },
          navigation: {
            nextEl: "#new-hero-section #rs-next",
            prevEl: "#new-hero-section #rs-prev",
          },
          autoplay:
            heroData?.settings.autoplay_enabled !== false
              ? {
                  delay: heroData?.settings.autoplay_delay || 5000,
                  disableOnInteraction: false,
                }
              : false,
          on: {
            autoplayTimeLeft(swiper, _time, progress) {
              const activeSlide = swiper.slides[
                swiper.activeIndex
              ] as HTMLElement;
              const bar = activeSlide?.querySelector(
                ".slide-progress-fill"
              ) as HTMLElement;
              if (bar) bar.style.width = `${(1 - progress) * 100}%`;
            },
            slideChange() {
              document
                .querySelectorAll("#new-hero-section .slide-progress-fill")
                .forEach((b: Element) => {
                  (b as HTMLElement).style.width = "0%";
                });
            },
            init() {
              console.log("Swiper initialized successfully");
            },
          },
        });

        console.log("Swiper created:", swiperRef.current);
      } catch (error) {
        console.error("Swiper initialization failed:", error);
      }
    };

    // Initialize with proper timing - increased delays to ensure DOM is ready
    const swiperTimer = setTimeout(initializeSwiper, 800);

    return () => {
      isComponentMounted = false;

      // Cleanup timers
      clearTimeout(maxWaitTimer);
      clearTimeout(swiperTimer);

      // Cleanup Swiper
      if (swiperRef.current) {
        try {
          swiperRef.current.destroy(true, true);
          swiperRef.current = null;
        } catch (error) {
          console.warn("Swiper cleanup failed:", error);
        }
      }
    };
  }, [loading, heroData]);

  if (loading) {
    return (
      <section className="hero-section">
        <div className="hero-loading">Loading...</div>
      </section>
    );
  }

  return (
    <>
      <section
        ref={heroSectionRef}
        className="hero-section new-hero-section"
        id="new-hero-section"
      >
        {/* Poster image - always show if available, serves as fallback/loading state */}
        {heroData?.background.image && (
          <div
            className={`image-background ${
              heroData?.background.video_url ? "video-poster" : ""
            }`}
            style={{
              backgroundImage: `url(${heroData.background.image.desktop})`,
            }}
          />
        )}

        {/* Video - loads over the poster image */}
        {heroData?.background.video_url &&
          (heroData.background.video_url.includes("vimeo.com") ? (
            <iframe
              className="video-background vimeo-iframe"
              style={{
                backgroundColor: heroData?.background.image?.desktop
                  ? "transparent"
                  : "#1a1a1a",
              }}
              src={`https://player.vimeo.com/video/${
                heroData.background.video_url.match(/vimeo\.com\/(\d+)/)?.[1]
              }?autoplay=1&loop=1&muted=1&background=1&controls=0&title=0&byline=0&portrait=0&dnt=1&quality=540p&autopause=0&playsinline=1&transparent=0`}
              allow="autoplay; fullscreen"
              loading="eager"
              title="Hero Background Video"
              onLoad={() => {
                // Just wait a very long time to ensure Vimeo is actually playing
                setTimeout(() => {
                  const poster = document.querySelector(
                    "#new-hero-section .video-poster"
                  );
                  if (poster) {
                    (poster as HTMLElement).style.opacity = "0";
                  }
                }, 5000); // Wait 5 full seconds for Vimeo
              }}
            />
          ) : (
            <video
              className="video-background"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              disablePictureInPicture
              preload="auto"
              onCanPlay={() => {
                // Hide poster immediately when MP4 video can play
                const poster = document.querySelector(
                  "#new-hero-section .video-poster"
                );
                if (poster) {
                  (poster as HTMLElement).style.opacity = "0";
                }
              }}
            >
              <source src={heroData.background.video_url} type="video/mp4" />
            </video>
          ))}
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <span className="hero-text-line-1 block">WE BUILD</span>
              <span className="hero-text-line-2 block">YOUR DREAMS</span>
            </h1>
          </div>

          <div className="hero-bottom">
            <div className="discover-box">
              <a href={heroData?.cta.link || "#contact"} className="cta-link">
                <span
                  className="cta-text"
                  data-text={heroData?.cta.text || "Get a Free Site Visit"}
                >
                  <span>{heroData?.cta.text || "Get a Free Site Visit"}</span>
                </span>
                <span className="arrow">→</span>
              </a>
            </div>

            <div className="slider-container">
              <div className="c-carousel-news_controls">
                <button
                  className="c-button -icon c-carousel_news_button -next"
                  id="rs-next"
                  aria-label="Next"
                >
                  <span className="c-button_inner">
                    <span className="u-screen-reader-text">Next</span>
                    <span className="c-button_icon">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M8 4l8 8-8 8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </button>
                <button
                  className="c-button -icon c-carousel_news_button -prev"
                  id="rs-prev"
                  aria-label="Previous"
                >
                  <span className="c-button_inner">
                    <span className="u-screen-reader-text">Previous</span>
                    <span className="c-button_icon">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M16 4L8 12l8 8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>

              <div className="swiper heroSwiper">
                <div className="swiper-wrapper">
                  {heroData?.slides &&
                  heroData.slides.length > 0 &&
                  heroData.slides.some((slide) => slide.image?.desktop) ? (
                    heroData.slides
                      .filter((slide) => slide.image?.desktop)
                      .map((slide) => (
                        <div key={slide.id} className="swiper-slide">
                          <div className="slide-wrapper">
                            <img
                              className="slide-image"
                              src={slide.image.desktop}
                              srcSet={`${slide.image.mobile} 700w, ${slide.image.tablet} 1000w, ${slide.image.desktop} 1200w`}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                              alt={slide.image.alt || slide.title}
                              loading="lazy"
                              key={`${slide.id}-${Date.now()}`}
                            />
                            <div className="slide-progress-bar">
                              <div className="slide-progress-fill"></div>
                            </div>
                            <div className="slide-content">
                              <h3 className="slide-title">{slide.title}</h3>
                              {slide.button && (
                                <a
                                  href={slide.button.url}
                                  className="slide-link"
                                  target={
                                    slide.button.is_external
                                      ? "_blank"
                                      : "_self"
                                  }
                                  rel={
                                    slide.button.is_external
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                >
                                  {slide.button.text}{" "}
                                  <span className="arrow">→</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    // Fallback slides if no data
                    <>
                      <div className="swiper-slide">
                        <div className="slide-wrapper">
                          <img
                            className="slide-image"
                            src={`${import.meta.env.BASE_URL}images/1.jpg`}
                            alt="Garden Design"
                            loading="lazy"
                          />
                          <div className="slide-progress-bar">
                            <div className="slide-progress-fill"></div>
                          </div>
                          <div className="slide-content">
                            <h3 className="slide-title">
                              Garden Design & Installation
                            </h3>
                            <a href="#" className="slide-link">
                              Read more <span className="arrow">→</span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="slide-wrapper">
                          <img
                            className="slide-image"
                            src={`${import.meta.env.BASE_URL}images/2.jpg`}
                            alt="Landscaping Project"
                            loading="lazy"
                          />
                          <div className="slide-progress-bar">
                            <div className="slide-progress-fill"></div>
                          </div>
                          <div className="slide-content">
                            <h3 className="slide-title">
                              Outdoor Living Spaces
                            </h3>
                            <a href="#" className="slide-link">
                              Read more <span className="arrow">→</span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="slide-wrapper">
                          <img
                            className="slide-image"
                            src={`${import.meta.env.BASE_URL}images/3.jpg`}
                            alt="Sustainable Landscaping"
                            loading="lazy"
                          />
                          <div className="slide-progress-bar">
                            <div className="slide-progress-fill"></div>
                          </div>
                          <div className="slide-content">
                            <h3 className="slide-title">
                              Sustainable Eco-Friendly Gardens
                            </h3>
                            <a href="#" className="slide-link">
                              Read more <span className="arrow">→</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const NewHeroSection: React.FC = () => {
  return (
    <HeroErrorBoundary>
      <NewHeroSectionContent />
    </HeroErrorBoundary>
  );
};

export default NewHeroSection;
