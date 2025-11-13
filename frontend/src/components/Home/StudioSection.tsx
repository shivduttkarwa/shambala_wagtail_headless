import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./StudioSection.css";

gsap.registerPlugin(ScrollTrigger);

interface StudioSectionProps {
  title?: string;
  subtitle?: string;
  description?: string[];
  images?: {
    src: string;
    desktop?: string;
    tablet?: string;
    mobile?: string;
    alt: string;
  }[];
  ctaText?: string;
  ctaHref?: string;
}

const publicUrl = import.meta.env.BASE_URL;

const StudioSection: React.FC<StudioSectionProps> = ({
  title = "Our Studio",
  subtitle,
  description = [
    "Transform your outdoor space into a breathtaking sanctuary with our expert landscaping services. We specialize in creating stunning gardens that reflect your unique style and enhance your property's value.",
    "Our experienced team combines artistic vision with horticultural expertise to design and implement landscapes that thrive in every season. From concept to completion, we're committed to exceeding your expectations.",
    "Schedule a consultation today and discover how we can bring your dream outdoor space to life.",
  ],
  images = [
    {
      src: `${publicUrl}images/l2.jpg`,
      alt: "Beautiful landscaped garden",
    },
    {
      src: `${publicUrl}images/l5.jpg`,
      alt: "Modern outdoor design",
    },
  ],
  ctaText = "Get Started",
  ctaHref = "#contact",
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Image grows from bottom-left corner to full
      gsap.fromTo(
        ".reveal-img",
        {
          scale: 0,
          opacity: 0,
          transformOrigin: "0% 100%", // bottom-left
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: "power0.none",
          scrollTrigger: {
            trigger: ".studio-layout",
            start: "top 50%", // when main section hits 90% of viewport height
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="section-feature" ref={sectionRef}>
      <div className="studio-container">
        <div className="studio-layout">
          {/* Left side: Image 1 - half width, full height */}
          <div className="left-image">
            <img
              src={images[0].desktop || images[0].src}
              alt={images[0].alt}
              className="studio-image reveal-img"
              loading="lazy"
            />
          </div>

          {/* Right side: Content and Image 2 */}
          <div className="right-content">
            {/* Content area: 60% height */}
            <div className="content-area">
              <h2
                className="studio-title"
                style={{ textAlign: "center", overflow: "visible" }}
              >
                {title}
              </h2>
              {subtitle && <h3 className="studio-subtitle">{subtitle}</h3>}
              <div className="studio-description">
                {description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <a href={ctaHref} className="studio-cta">
                {ctaText}
              </a>
            </div>

            {/* Image 2: 40% height */}
            <div className="right-image">
              <img
                src={images[1].desktop || images[1].src}
                alt={images[1].alt}
                className="studio-image reveal-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;
