import React, { useState } from 'react';
import { HouseDesignFilters as FilterOptions } from '../../types';
import './HouseDesignFilters.css';

interface HouseDesignFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Record<string, string>) => void;
  activeFilters: Record<string, string>;
  resultsCount: number;
}

const HouseDesignFilters: React.FC<HouseDesignFiltersProps> = ({
  filters,
  onFilterChange,
  activeFilters,
  resultsCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters };
    
    if (newFilters[filterKey] === value) {
      // Toggle off if clicking the same filter
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }
    
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="house-design-filters">
      {/* Filter Header */}
      <div className="filters-header">
        <h3 className="filters-title">
          STOREYS
        </h3>
        <div className="filters-actions">
          <button 
            className="more-filters-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
            </svg>
            More filters
          </button>
          {hasActiveFilters && (
            <button className="reset-btn" onClick={clearAllFilters}>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Storeys Filter (Always Visible) */}
      <div className="filter-group">
        <div className="filter-options">
          {filters.storeys.map((option) => (
            <button
              key={option.value}
              className={`filter-option ${activeFilters.storeys === option.value ? 'active' : ''}`}
              onClick={() => handleFilterChange('storeys', option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="filters-expanded">
          {/* Bedrooms */}
          <div className="filter-group">
            <h4 className="filter-group-title">BEDS</h4>
            <div className="filter-options">
              {filters.bedrooms.map((option) => (
                <button
                  key={option.value}
                  className={`filter-option ${activeFilters.bedrooms === option.value ? 'active' : ''}`}
                  onClick={() => handleFilterChange('bedrooms', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div className="filter-group">
            <h4 className="filter-group-title">BATHS</h4>
            <div className="filter-options">
              {filters.bathrooms.map((option) => (
                <button
                  key={option.value}
                  className={`filter-option ${activeFilters.bathrooms === option.value ? 'active' : ''}`}
                  onClick={() => handleFilterChange('bathrooms', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price */}
          <div className="filter-group">
            <h4 className="filter-group-title">MAX BASE PRICE</h4>
            <div className="filter-options">
              {filters.price_ranges.map((option) => (
                <button
                  key={option.value}
                  className={`filter-option ${activeFilters.max_price === option.value ? 'active' : ''}`}
                  onClick={() => handleFilterChange('max_price', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Block Width - Placeholder for now */}
          <div className="filter-group">
            <h4 className="filter-group-title">MIN BLOCK WIDTH</h4>
            <div className="filter-dropdown">
              <select className="filter-select">
                <option value="">Any</option>
              </select>
            </div>
          </div>

          {/* Max Block Width - Placeholder for now */}
          <div className="filter-group">
            <h4 className="filter-group-title">MAX BLOCK WIDTH</h4>
            <div className="filter-dropdown">
              <select className="filter-select">
                <option value="">Any</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="filters-results">
        <span className="results-text">
          <strong>{resultsCount}</strong> home design{resultsCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Sort By */}
      <div className="filters-sort">
        <label htmlFor="sortBy" className="sort-label">Sort by:</label>
        <select id="sortBy" className="sort-select">
          <option value="name-asc">Name (A to Z)</option>
          <option value="name-desc">Name (Z to A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="beds-asc">Bedrooms (Low to High)</option>
          <option value="beds-desc">Bedrooms (High to Low)</option>
        </select>
      </div>
    </div>
  );
};

export default HouseDesignFilters;
