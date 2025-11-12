import React, { useEffect, useRef } from "react";
import "./AboutPage.css";

const AboutPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simplified version without GSAP animations
    console.log("AboutPage initialized");
  }, []);

  const values = [
    {
      icon: "🏆",
      title: "Excellence",
      description:
        "We strive for perfection in every detail of our work, ensuring the highest quality standards.",
    },
    {
      icon: "🤝",
      title: "Integrity",
      description:
        "Honesty and transparency guide our relationships with clients, partners, and team members.",
    },
    {
      icon: "💡",
      title: "Innovation",
      description:
        "We embrace new technologies and creative solutions to build homes of the future.",
    },
    {
      icon: "🌱",
      title: "Sustainability",
      description:
        "Environmental responsibility is at the core of our design and construction processes.",
    },
  ];

  const stats = [
    { number: 500, label: "Homes Built", suffix: "+" },
    { number: 25, label: "Years Experience", suffix: "+" },
    { number: 98, label: "Client Satisfaction", suffix: "%" },
    { number: 50, label: "Team Members", suffix: "+" },
  ];

  const team = [
    {
      name: "John Anderson",
      role: "Founder & CEO",
      image: "/images/team/team-1.jpg",
      bio: "Visionary leader with 30 years in construction",
    },
    {
      name: "Sarah Mitchell",
      role: "Head of Design",
      image: "/images/team/team-2.jpg",
      bio: "Award-winning architect passionate about sustainable design",
    },
    {
      name: "Michael Chen",
      role: "Construction Manager",
      image: "/images/team/team-3.jpg",
      bio: "Expert in project management and quality control",
    },
    {
      name: "Emily Rodriguez",
      role: "Client Relations",
      image: "/images/team/team-4.jpg",
      bio: "Dedicated to creating exceptional client experiences",
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" ref={heroRef}>
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <span className="hero-tag">About Shambala Homes</span>
          <h1>Building Dreams, Creating Homes</h1>
          <p className="hero-subtitle">
            For over 25 years, we've been crafting exceptional living spaces
            that blend innovative design, superior craftsmanship, and
            sustainable building practices.
          </p>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story" ref={storyRef}>
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <span className="section-tag">Our Journey</span>
              <h2>A Legacy of Excellence</h2>
              <div className="story-text">
                <p>
                  Founded in 1998, Shambala Homes began with a simple vision: to
                  create homes that inspire and endure. What started as a small
                  family business has grown into one of the region's most
                  trusted home builders.
                </p>
                <p>
                  Our founder, John Anderson, brought decades of construction
                  expertise and a passion for quality craftsmanship. His
                  commitment to excellence and client satisfaction laid the
                  foundation for everything we do today.
                </p>
                <p>
                  Today, we're proud to have built over 500 homes, each one a
                  testament to our dedication to quality, innovation, and
                  sustainable building practices. Our team has grown, but our
                  values remain the same: integrity, excellence, and a genuine
                  care for our clients' dreams.
                </p>
              </div>
              <div className="story-signature">
                <div className="signature-line"></div>
                <p>Building communities, one home at a time</p>
              </div>
            </div>
            <div className="story-image">
              <div className="image-wrapper">
                <img src="/images/about/story.jpg" alt="Our story" />
                <div className="image-decoration"></div>
              </div>
              <div className="story-badge">
                <span className="badge-number">25+</span>
                <span className="badge-text">Years of Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number" data-target={stat.number}>
                  0
                </div>
                <span className="stat-suffix">{stat.suffix}</span>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values" ref={valuesRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Values</span>
            <h2>What Drives Us</h2>
            <p className="section-subtitle">
              Our core values guide every decision we make and every home we
              build
            </p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team" ref={teamRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Meet The Team</span>
            <h2>The People Behind Your Dream Home</h2>
            <p className="section-subtitle">
              Our experienced team is dedicated to bringing your vision to life
            </p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                  <div className="member-overlay">
                    <p>{member.bio}</p>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Let's work together to create the home of your dreams</p>
            <div className="cta-buttons">
              <a href="/shambala_homes/contact" className="btn btn-primary">
                Get in Touch
              </a>
              <a
                href="/shambala_homes/house-designs"
                className="btn btn-secondary"
              >
                View Our Designs
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
