import React from 'react';
import { HouseDesign as HouseDesignType } from '../../types';
import './HouseDesignCard.css';

interface HouseDesignCardProps {
  design: HouseDesignType;
  onCompare?: (design: HouseDesignType) => void;
  isComparing?: boolean;
}

const HouseDesignCard: React.FC<HouseDesignCardProps> = ({ 
  design, 
  onCompare,
  isComparing = false 
}) => {
  return (
    <div className="house-design-card">
      {/* Badges */}
      <div className="house-card-badges">
        {design.badges.on_display && (
          <span className="badge badge-primary">On display</span>
        )}
        {design.badges.virtual_tour && (
          <span className="badge badge-info">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z"/>
            </svg>
            Virtual tour
          </span>
        )}
      </div>

      {/* Image */}
      <div className="house-card-image-wrapper">
        {design.image ? (
          <img 
            src={design.image.url} 
            alt={design.image.alt || design.name}
            className="house-card-image"
            loading="lazy"
          />
        ) : (
          <div className="house-card-placeholder">
            <span>No image available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="house-card-content">
        {/* Category Tag */}
        {design.category && (
          <div className="house-card-category">{design.category.name}</div>
        )}

        {/* Title */}
        <h3 className="house-card-title">{design.name}</h3>

        {/* Specs */}
        <div className="house-card-specs">
          <div className="spec-item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 3L2 9v11c0 .55.45 1 1 1h5v-7h8v7h5c.55 0 1-.45 1-1V9l-10-6z"/>
            </svg>
            <span>{design.specs.storeys_label}</span>
          </div>
          <div className="spec-item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 7h-8v6h8V7m0 9h-8v4h8v-4m2-12H3v18h18V4z"/>
            </svg>
            <span>{design.specs.bedrooms} Beds</span>
          </div>
          <div className="spec-item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M8 14c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m4 1c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1m3 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1m4-12H5v16h14V3z"/>
            </svg>
            <span>{design.specs.bathrooms} Baths</span>
          </div>
          <div className="spec-item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 2H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h4v2h6v-2h4c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2m0 16H5V4h14v14z"/>
            </svg>
            <span>{design.specs.garage_spaces} Car</span>
          </div>
        </div>

        {/* Footer */}
        <div className="house-card-footer">
          <div className="house-card-price">{design.pricing.display}</div>
          <button 
            className={`compare-btn ${isComparing ? 'active' : ''}`}
            onClick={() => onCompare?.(design)}
            aria-label="Compare"
            title="Add to compare"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseDesignCard;
