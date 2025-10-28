import { useState } from "react";

export default function SearchFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    location: "",
    sortBy: "newest",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      minPrice: "",
      maxPrice: "",
      location: "",
      sortBy: "newest",
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h3>Filter Properties</h3>
        <button onClick={clearFilters} className="clear-btn">
          Clear All
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Min Price (Cr)</label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Max Price (Cr)</label>
          <input
            type="number"
            placeholder="10"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="Enter city"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <style jsx>{`
        .search-filters {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .filters-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 1.25rem;
        }
        .clear-btn {
          background: #6b7280;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        .clear-btn:hover {
          background: #4b5563;
        }
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .filter-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }
        .filter-group input,
        .filter-group select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        .filter-group input:focus,
        .filter-group select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
