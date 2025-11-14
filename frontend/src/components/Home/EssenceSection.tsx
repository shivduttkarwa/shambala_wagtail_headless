import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EssenceSection.css";

gsap.registerPlugin(ScrollTrigger);

interface EssenceSectionProps {
  logo?: string;
  tagline?: string;
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  image?: {
    src: string;
    desktop?: string;
    tablet?: string;
    mobile?: string;
    alt: string;
  };
  videoUrl?: string;
}

const publicUrl = import.meta.env.BASE_URL;

const EssenceSection: React.FC<EssenceSectionProps> = ({
  logo,
  tagline = "WHY SHAMBALA HOMES?",
  heading = "WE SHAPE THE ESSENCE OF LIVING",
  description = "We envision spaces that are not just lived in, but felt — where every element has been curated to inspire connection, serenity, and a profound sense of belonging. Each project reflects a deep understanding of our clients' evolving lifestyles, blending timeless aesthetics with intelligent innovation and sustainable craftsmanship.",
  ctaText = "VIEW OUR DESIGNS",
  ctaHref = "#house-designs",
  image = {
    src: `${publicUrl}images/3.jpg`,
    alt: "Modern architectural design",
  },
  videoUrl = `${publicUrl}images/hero1.mp4`,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const imageOverlayRef = useRef<HTMLDivElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Restart from beginning
      videoRef.current.muted = false; // Unmute
      videoRef.current.controls = true; // Show controls
      videoRef.current.play();
      setShowOverlay(false);
    }
  };

  const handleVideoPause = () => {
    // Video paused
  };

  const handleVideoEnded = () => {
    setShowOverlay(true);
  };

  // Split text into characters for tagline
  const splitTextIntoChars = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className="char">
        {char}
      </span>
    ));
  };

  // Split text into lines with mask
  const splitTextIntoLines = (text: string) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      if (testLine.length > 30 && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.map((line, index) => (
      <div key={index} className="mask">
        <div className="line">{line}</div>
      </div>
    ));
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const taglineChars = taglineRef.current?.querySelectorAll(".char");
      const headingLines = headingRef.current?.querySelectorAll(".line");

      // Set initial states (prevents layout shift)
      if (taglineChars && taglineChars.length > 0) {
        gsap.set(taglineChars, {
          opacity: 0,
          y: 20,
        });
      }
      if (headingLines && headingLines.length > 0) {
        gsap.set(headingLines, {
          yPercent: 100,
        });
      }
      if (ctaRef.current) {
        gsap.set(ctaRef.current, {
          opacity: 0,
          y: 30,
        });
      }

      // Single timeline for all animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      });

      // Tagline chars - simple fade up
      if (taglineChars && taglineChars.length > 0) {
        tl.to(
          taglineChars,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.03,
            ease: "power2.out",
          },
          0
        );
      }

      // Heading lines - slide up
      if (headingLines && headingLines.length > 0) {
        tl.to(
          headingLines,
          {
            yPercent: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: "power3.out",
          },
          0.2
        );
      }

      // CTA button
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          0.6
        );
      }

      // Image reveal - separate ScrollTrigger
      if (imageOverlayRef.current) {
        gsap.to(imageOverlayRef.current, {
          scaleX: 0,
          duration: 2.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: imageOverlayRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <section className="essence-section" ref={sectionRef}>
      {/* Main Content Section */}
      <div className="essence-container">
        <div className="essence-layout">
          {/* Left side: Content with beige background */}
          <div className="essence-content">
            {logo && (
              <div className="essence-logo">
                <img src={logo} alt="Logo" />
              </div>
            )}

            <div className="essence-tagline" ref={taglineRef}>
              {splitTextIntoChars(tagline)}
            </div>

            <h2 className="essence-heading" ref={headingRef}>
              {splitTextIntoLines(heading)}
            </h2>

            <p className="essence-description">{description}</p>

            <a href={ctaHref} className="essence-cta" ref={ctaRef}>
              {ctaText}
            </a>
          </div>

          {/* Right side: Large image */}
          <div className="essence-image">
            <img
              src={image.src}
              srcSet={
                image.mobile && image.tablet && image.desktop
                  ? `${image.mobile} 700w, ${image.tablet} 1000w, ${image.desktop} 1200w`
                  : undefined
              }
              sizes={
                image.mobile && image.tablet && image.desktop
                  ? "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                  : undefined
              }
              alt={image.alt}
              className="essence-img"
            />
            {/* Image reveal overlay */}
            <div className="essence-image-overlay" ref={imageOverlayRef}></div>
          </div>
        </div>
      </div>

      {/* Video Subsection */}
      {videoUrl && (
        <div className="essence-video-section">
          <video
            ref={videoRef}
            className="essence-video"
            autoPlay
            muted
            loop
            playsInline
            onPause={handleVideoPause}
            onEnded={handleVideoEnded}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay with Play Button */}
          {showOverlay && (
            <div className="essence-video-overlay">
              <button
                className="essence-video-play-btn"
                onClick={handlePlayClick}
                aria-label="Play video with sound"
              >
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="38"
                    stroke="white"
                    strokeWidth="2"
                    fill="rgba(255, 255, 255, 0.15)"
                  />
                  <path d="M32 25L32 55L55 40L32 25Z" fill="white" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default EssenceSection;
