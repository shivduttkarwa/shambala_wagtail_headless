import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./FeaturedProperties.css";

interface PropertySlide {
  id: number;
  category: string;
  title: string;
  leftImage: string;
  rightImage: string;
  tabletImage: string;
  subtitle: string;
  description: string;
  link: string;
}

const defaultProperties: PropertySlide[] = [
  {
    id: 1,
    category: "",
    title: "LUXURY\nVILLAS\n& ESTATES",
    leftImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=1600&fit=crop&q=90",
    rightImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=1600&fit=crop&q=90", 
    tabletImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=800&fit=crop&q=90",
    subtitle: "Premium Residential Projects",
    description: "Where luxury meets lifestyle.\n\nShambala Homes presents thoughtfully designed residences that blend modern architecture with timeless elegance. Every project is crafted with attention to detail, premium materials, and world-class amenities for discerning homeowners.",
    link: "#"
  },
  {
    id: 2,
    category: "", 
    title: "LUXURY\nVILLAS\n& ESTATES",
    leftImage: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=1600&fit=crop&q=90",
    rightImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=1600&fit=crop&q=90",
    tabletImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=800&fit=crop&q=90", 
    subtitle: "Contemporary Living Spaces",
    description: "Innovation in every corner.\n\nOur contemporary homes feature open-plan layouts, floor-to-ceiling windows, and smart home integration. Designed for modern families who value both style and functionality in their living spaces.",
    link: "#"
  },
  {
    id: 3,
    category: "",
    title: "LUXURY\nVILLAS\n& ESTATES", 
    leftImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=1600&fit=crop&q=90",
    rightImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=1600&fit=crop&q=90",
    tabletImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=800&fit=crop&q=90",
    subtitle: "Luxury Villa Collection", 
    description: "Redefined elegance.\n\nExclusive villas featuring private gardens, swimming pools, and panoramic views. Each home is uniquely designed to offer privacy, luxury, and comfort in prime locations across the city.",
    link: "#"
  },
  {
    id: 4,
    category: "",
    title: "LUXURY\nVILLAS\n& ESTATES",
    leftImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=1600&fit=crop&q=90", 
    rightImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=1600&fit=crop&q=90",
    tabletImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=800&fit=crop&q=90",
    subtitle: "Signature Developments",
    description: "Excellence by design.\n\nOur flagship projects showcase innovative architecture, sustainable building practices, and premium amenities. From concept to completion, every Shambala home represents the pinnacle of quality and craftsmanship.",
    link: "#"
  }
];

interface FeaturedPropertiesProps {
  properties?: PropertySlide[];
}

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ 
  properties = defaultProperties 
}) => {
  const swiperRef = useRef<any>(null);

  return (
    <section id="home_accommodation">
      <div className="swiper accommodation_swipe">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          speed={1000}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="swiper"
        >
          <div className="swiper-wrapper">
            {properties.map((property) => (
              <SwiperSlide key={property.id} className="swiper-slide">
                <div className="left">
                  {property.category && <p>{property.category}</p>}
                  <h2>{property.title}</h2>
                  <div className="left-navigation">
                    <button className="nav-btn swiper-button-prev">
                      <div className="btn-outline btn-outline-1"></div>
                      <div className="btn-outline btn-outline-2"></div>
                      <div className="arrow-container">
                        <svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M30 6H1M1 6L6 1M1 6L6 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                    <button className="nav-btn swiper-button-next">
                      <div className="btn-outline btn-outline-1"></div>
                      <div className="btn-outline btn-outline-2"></div>
                      <div className="arrow-container">
                        <svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 6H29M29 6L24 1M29 6L24 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                  <div className="image">
                    <img
                      src={property.leftImage}
                      alt={property.subtitle}
                    />
                    <img
                      className="image-tablet"
                      src={property.tabletImage}
                      alt={property.subtitle}
                    />
                  </div>
                </div>
                <div className="right">
                  <div className="image">
                    <img
                      src={property.rightImage}
                      alt={property.subtitle}
                    />
                  </div>
                  <h4>{property.subtitle}</h4>
                  <div className="text">
                    <p>{property.description}</p>
                  </div>
                  <a href={property.link} className="arrow_link">
                    <span>Discover</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 50.987 14.208"
                    >
                      <g transform="translate(-1143 -7586.331)">
                        <path
                          d="M7.5,18H57.073"
                          transform="translate(1135.5 -7575.435)"
                          fill="none"
                          stroke="#1a1a1a"
                          strokeWidth="2"
                        />
                        <path
                          d="M18,7.5l6.4,6.4-6.4,6.4"
                          transform="translate(1168.175 7579.538)"
                          fill="none"
                          stroke="#1a1a1a"
                          strokeWidth="2"
                        />
                      </g>
                    </svg>
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </div>

      <a href="#" className="discover-all-link">
        <span>Discover All</span>
      </a>
    </section>
  );
};

export default FeaturedProperties;