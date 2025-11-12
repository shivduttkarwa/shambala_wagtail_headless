import React from "react";
import "./DreamHomeJourney.css";

const publicUrl = import.meta.env.BASE_URL;

interface DreamHomeJourneyProps {
  title?: string;
  description?: string;
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  backgroundImage?: string;
}

const DreamHomeJourney: React.FC<DreamHomeJourneyProps> = ({
  title = "Dream Home",
  description = "From concept to completion, we guide you through every step of creating your perfect living space. Our expert team combines innovative design with superior craftsmanship.",
  primaryCta = {
    text: "Start Your Journey",
    link: "#",
  },
  secondaryCta = {
    text: "View Portfolio",
    link: "#",
  },
  backgroundImage = `${publicUrl}images/wooden-bg.jpg`,
}) => {
  return (
    <section
      className="dream-journey"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="dream-overlay"></div>
      <div className="dream-container">
        <h2
          className="dream-title"
          style={{ textAlign: "center", overflow: "visible" }}
        >
          {title}
        </h2>
        <p className="dream-description">{description}</p>
        <div className="dream-ctas">
          <a
            href={primaryCta.link}
            className="dream-button dream-button-primary"
          >
            {primaryCta.text}
          </a>
          <a
            href={secondaryCta.link}
            className="dream-button dream-button-secondary"
          >
            {secondaryCta.text}
          </a>
        </div>
      </div>
    </section>
  );
};

export default DreamHomeJourney;
