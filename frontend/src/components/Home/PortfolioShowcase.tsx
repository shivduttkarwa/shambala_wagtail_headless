import React, { useEffect, useRef } from "react";
import "./PortfolioShowcase.css";

const projects = [
  {
    title: "Modern Zen Retreat",
    bg: "/shambala_homes/images/l11.jpg",
    thumb: "/shambala_homes/images/2.jpg",
    tags: ["3 Bed", "2 Bath", "1,800 Sqft", "Garden View"],
  },
  {
    title: "Luxury Villa Estate",
    bg: "/shambala_homes/images/l3.jpg",
    thumb: "/shambala_homes/images/11.jpg",
    tags: ["4 Bed", "3.5 Bath", "2,500 Sqft", "Pool", "Premium"],
  },
  {
    title: "Cozy Family Home",
    bg: "/shambala_homes/images/l10.jpg",
    thumb: "/shambala_homes/images/3.jpg",
    tags: ["2 Bed", "2 Bath", "1,200 Sqft", "Family Friendly", "Affordable"],
  },
];

// Image preloading function
const preloadImages = (imageSrcs: string[]) => {
  imageSrcs.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

const PortfolioShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const featureSection = sectionRef.current;
    if (!featureSection) return;

    // Preload all images immediately
    const allImageSrcs = projects.flatMap(project => [project.bg, project.thumb]);
    preloadImages(allImageSrcs);

    // Add class to body to allow overflow for sticky behavior
    document.body.classList.add("portfolio-active");

    // Check if device is mobile
    const isMobile = () => window.innerWidth < 940; // 58.75rem = 940px

    // PARALLAX – fully scoped to .project-feature
    const parallaxImages = featureSection.querySelectorAll<HTMLImageElement>(
      ".project > figure > img[data-speed]"
    );

<<<<<<< HEAD
    // Performance optimization variables
    let ticking = false;
    let lastScrollY = 0;
    const isMobile = window.innerWidth < 940;
=======
    let ticking = false;
    let lastScrollY = window.scrollY;
>>>>>>> 0fe19f0a7dbbac1b1b79d5f99e71dfe0a2e205ee

    function handleParallax() {
      if (!parallaxImages.length) return;

      const currentScrollY = window.scrollY;
      
<<<<<<< HEAD
      // Skip if scroll change is minimal (reduces calculations)
      if (Math.abs(currentScrollY - lastScrollY) < 2) return;
=======
      // Skip if scroll hasn't changed (prevents unnecessary calculations)
      if (Math.abs(currentScrollY - lastScrollY) < 1) return;
>>>>>>> 0fe19f0a7dbbac1b1b79d5f99e71dfe0a2e205ee
      lastScrollY = currentScrollY;

      if (!ticking) {
        requestAnimationFrame(() => {
          const viewportHeight = window.innerHeight;
<<<<<<< HEAD
=======
          const mobile = isMobile();
>>>>>>> 0fe19f0a7dbbac1b1b79d5f99e71dfe0a2e205ee

          parallaxImages.forEach((img) => {
            const rect = img.getBoundingClientRect();
            const imgCenter = rect.top + rect.height / 2;
            const distanceFromCenter = imgCenter - viewportHeight / 2;

<<<<<<< HEAD
            const baseSpeed = parseFloat(img.dataset.speed || "0.8");
            // Reduce intensity on mobile but keep parallax effect
            const speed = isMobile ? baseSpeed * 0.4 : baseSpeed;

            let translateY = (-distanceFromCenter / viewportHeight) * 100 * speed;
            
            // Constrain movement to prevent image clipping issues
            const maxMove = isMobile ? 20 : 30;
            translateY = Math.max(-maxMove, Math.min(maxMove, translateY));

            // Use hardware acceleration
=======
            // Reduce parallax intensity on mobile to prevent flickering
            const baseSpeed = parseFloat(img.dataset.speed || "0.8");
            const speed = mobile ? baseSpeed * 0.3 : baseSpeed;

            // Calculate parallax with bounds to prevent image disappearing
            let translateY = (-distanceFromCenter / viewportHeight) * 100 * speed;
            
            // Clamp translateY to prevent images from moving too far out of bounds
            // Reduced range to keep images visible
            const maxTransform = mobile ? 15 : 25; // Smaller range for mobile
            translateY = Math.max(-maxTransform, Math.min(maxTransform, translateY));

            // Use transform3d with will-change for better performance
>>>>>>> 0fe19f0a7dbbac1b1b79d5f99e71dfe0a2e205ee
            img.style.willChange = 'transform';
            img.style.transform = `translate3d(0, ${translateY}%, 0) scale(1.2)`;
          });

          ticking = false;
        });
<<<<<<< HEAD
=======

>>>>>>> 0fe19f0a7dbbac1b1b79d5f99e71dfe0a2e205ee
        ticking = true;
      }
    }

<<<<<<< HEAD
    // Use passive listeners for better scroll performance
    window.addEventListener("scroll", handleParallax, { passive: true });
=======
    // Throttle scroll events more aggressively on mobile
    let scrollTimeout: NodeJS.Timeout;
    function throttledScroll() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleParallax, isMobile() ? 16 : 8); // 60fps on mobile, 120fps on desktop
    }

    window.addEventListener("scroll", throttledScroll, { passive: true });
>>>>>>> 0fe19f0a7dbbac1b1b79d5f99e71dfe0a2e205ee
    window.addEventListener("load", handleParallax);
    window.addEventListener("resize", handleParallax);

    // Initial run
    handleParallax();

    return () => {
      // Remove class from body
      document.body.classList.remove("portfolio-active");
      clearTimeout(scrollTimeout);

      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("load", handleParallax);
      window.removeEventListener("resize", handleParallax);
      
      // Clean up will-change
      parallaxImages.forEach((img) => {
        img.style.willChange = 'auto';
      });
    };
  }, []);

  return (
    <section className="project-feature" ref={sectionRef}>
      <div className="block-text">
        <div className="block-text-col">
          <h3>Discover Your Dream Home</h3>
        </div>
      </div>

      <div className="projects-wrapper">
        {projects.map((project, index) => (
          <a href="#" className="project" key={project.title}>
            <figure>
              <img
                src={project.bg}
                alt={`${project.title} Background`}
                data-speed="0.8"
              />
            </figure>
            <div className="content">
              <div className="sticky">
                <div className="info-wrapper">
                  <h2>{project.title}</h2>
                  <div className="tag-wrapper">
                    {project.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="image-wrapper">
                  <figure>
                    <img
                      src={project.thumb}
                      alt={`${project.title} Interior`}
                    />
                  </figure>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="cta-wrapper">
        <a href="#" className="pf-button">
          <span>See More Projects</span>
          <span>→</span>
        </a>
      </div>
    </section>
  );
};

export default PortfolioShowcase;
