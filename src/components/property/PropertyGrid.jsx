import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ properties }) {
  if (!properties || properties.length === 0) {
    return (
      <div className="empty-state">
        <h3>No properties found</h3>
        <p>Be the first one to list a property!</p>
      </div>
    );
  }

  return (
    <div className="property-grid">
      {properties.map((property) => (
        <PropertyCard key={property.propertyId} property={property} />
      ))}

      <style jsx>{`
        .property-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          padding: 2rem 0;
        }
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }
        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        @media (max-width: 768px) {
          .property-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 1rem 0;
          }
        }
      `}</style>
    </div>
  );
}
