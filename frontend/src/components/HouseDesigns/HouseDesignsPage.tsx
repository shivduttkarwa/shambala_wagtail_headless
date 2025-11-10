import React, { useState, useMemo } from 'react';
import { HouseDesign, HouseDesignsPageData } from '../../types';
import HouseDesignCard from './HouseDesignCard';
import HouseDesignFilters from './HouseDesignFilters';
import './HouseDesignsPage.css';

interface HouseDesignsPageProps {
  pageData: HouseDesignsPageData;
}

const HouseDesignsPage: React.FC<HouseDesignsPageProps> = ({ pageData }) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [compareList, setCompareList] = useState<HouseDesign[]>([]);

  // Filter house designs based on active filters
  const filteredDesigns = useMemo(() => {
    let designs = [...pageData.house_designs_data];

    // Apply storeys filter
    if (activeFilters.storeys) {
      designs = designs.filter(d => d.specs.storeys === activeFilters.storeys);
    }

    // Apply bedrooms filter
    if (activeFilters.bedrooms) {
      designs = designs.filter(d => d.specs.bedrooms === parseInt(activeFilters.bedrooms));
    }

    // Apply bathrooms filter
    if (activeFilters.bathrooms) {
      const bathValue = parseFloat(activeFilters.bathrooms);
      designs = designs.filter(d => parseFloat(d.specs.bathrooms) >= bathValue);
    }

    // Apply price filter
    if (activeFilters.max_price) {
      const maxPrice = parseFloat(activeFilters.max_price);
      designs = designs.filter(d => {
        if (!d.pricing.base_price) return false; // Exclude if no price
        return parseFloat(d.pricing.base_price) <= maxPrice;
      });
    }

    return designs;
  }, [pageData.house_designs_data, activeFilters]);

  // Handle compare toggle
  const handleCompareToggle = (design: HouseDesign) => {
    setCompareList((prev) => {
      const exists = prev.find(d => d.id === design.id);
      if (exists) {
        return prev.filter(d => d.id !== design.id);
      } else {
        // Limit to 3 items for comparison
        if (prev.length >= 3) {
          alert('You can only compare up to 3 designs at a time');
          return prev;
        }
        return [...prev, design];
      }
    });
  };

  const isInCompareList = (designId: number) => {
    return compareList.some(d => d.id === designId);
  };

  return (
    <div className="house-designs-page">
      {/* Hero Section */}
      <section className={`house-designs-hero ${pageData.hero_data?.background_image ? 'has-image' : ''}`}>
        {pageData.hero_data?.background_image && (
          <>
            <img
              src={pageData.hero_data.background_image.url}
              alt={pageData.hero_data.background_image.alt || 'Hero background'}
              className="hero-background-image"
            />
            <div 
              className="hero-background-overlay"
              style={{ 
                opacity: pageData.hero_data.overlay_opacity || 0.7 
              }}
            />
          </>
        )}
        <div className="hero-pattern-overlay" />
        <div className="house-designs-hero-content">
          <h1 className="house-designs-hero-title">
            {pageData.hero_data?.title || pageData.intro_title || 'Discover Your Dream Home'}
          </h1>
          {(pageData.hero_data?.subtitle || pageData.intro_text) && (
            <div 
              className="house-designs-hero-subtitle"
              dangerouslySetInnerHTML={{ 
                __html: pageData.hero_data?.subtitle || pageData.intro_text || ''
              }}
            />
          )}
          <div className="house-designs-hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">{filteredDesigns.length}</span>
              <span className="hero-stat-label">House Designs</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">3+</span>
              <span className="hero-stat-label">Storey Options</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">45+</span>
              <span className="hero-stat-label">Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <HouseDesignFilters
        filters={pageData.filter_options}
        onFilterChange={setActiveFilters}
        activeFilters={activeFilters}
        resultsCount={filteredDesigns.length}
      />

      {/* Designs Grid */}
      <div className="designs-section">
        <div className="container">
          {filteredDesigns.length > 0 ? (
            <div className="designs-grid">
              {filteredDesigns.map((design) => (
                <HouseDesignCard
                  key={design.id}
                  design={design}
                  onCompare={handleCompareToggle}
                  isComparing={isInCompareList(design.id)}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No designs found</h3>
              <p>Try adjusting your filters to see more results</p>
              <button 
                className="reset-filters-btn"
                onClick={() => setActiveFilters({})}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <div className="compare-bar-content">
            <div className="compare-items">
              <span className="compare-count">
                {compareList.length} design{compareList.length !== 1 ? 's' : ''} selected
              </span>
              {compareList.map((design) => (
                <div key={design.id} className="compare-item">
                  <span>{design.name}</span>
                  <button 
                    className="remove-compare"
                    onClick={() => handleCompareToggle(design)}
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="compare-actions">
              <button 
                className="compare-clear-btn"
                onClick={() => setCompareList([])}
              >
                Clear
              </button>
              <button 
                className="compare-submit-btn"
                disabled={compareList.length < 2}
              >
                Compare ({compareList.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseDesignsPage;
