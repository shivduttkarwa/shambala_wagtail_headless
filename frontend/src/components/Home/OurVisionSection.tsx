import React, { useLayoutEffect, useRef } from "react";
import "./OurVisionSection.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface OurVisionSectionProps {
  leftText?: string;
  rightText?: string;
  centerImage?: {
    src: string;
    alt: string;
    overlayText?: string;
  };
}

const publicUrl = import.meta.env.BASE_URL;

const OurVisionSection: React.FC<OurVisionSectionProps> = ({
  leftText = "OUR",
  rightText = "VISION",
  centerImage = {
    src: `${publicUrl}images/project2.jpg`,
    alt: "Modern architecture and design",
    overlayText: "Our approach",
  },
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 968;

      if (!isMobile) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: true,
            pinSpacing: false, // This prevents artificial spacing that causes lag
            anticipatePin: 1,
          },
        });

        tl.to(
          ".vision-image-container",
          {
            scale: 1.3, // 2X image size
            ease: "none",
          },
          0
        ).to(
          ".vision-text-right .vision-large-text",
          {
            y: -450, // your existing value
            ease: "none",
          },
          0
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="our-vision-section" ref={sectionRef}>
      <div className="vision-container">
        <div className="vision-layout">
          {/* Left Text */}
          <div className="vision-text-left">
            <h2 className="vision-large-text">{leftText}</h2>
          </div>

          {/* Center Image */}
          <div className="vision-image-container">
            <img
              src={centerImage.src}
              alt={centerImage.alt}
              className="vision-image"
              loading="lazy"
            />
            {centerImage.overlayText && (
              <div className="vision-overlay">
                <span className="overlay-text">{centerImage.overlayText}</span>
              </div>
            )}
          </div>

          {/* Right Text */}
          <div className="vision-text-right">
            <h2 className="vision-large-text">{rightText}</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurVisionSection;
