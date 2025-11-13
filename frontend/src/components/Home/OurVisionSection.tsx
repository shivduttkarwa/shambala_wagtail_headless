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
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
    alt: "Modern architecture and design",
    overlayText: "Our approach",
  },
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", // when top of section hits 80% of viewport
          end: "bottom top", // until bottom of section hits top of viewport
          scrub: true, // smooth scrubbing
        },
      });

      tl.to(
        ".vision-image-container",
        {
          scale: 2, // 2X image size
          ease: "none",
        },
        0
      ).to(
        ".vision-text-right .vision-large-text",
        {
          y: -900, // move VISION up by 200px
          ease: "none",
        },
        0
      );
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
