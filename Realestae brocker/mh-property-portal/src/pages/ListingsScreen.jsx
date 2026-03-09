import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sampleProperties, sampleBrokers } from '../data/sampleProperties';

export default function ListingsScreen({ buyerPhone, buyerName }) {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const propertyTypes = ['All', 'Land', 'Plot', 'House', 'Flat', 'Commercial'];
  const districts = ['All', 'Pune', 'Nashik', 'Aurangabad', 'Satara', 'Kolhapur', 'Ratnagiri'];

  useEffect(() => {
    // Check if buyer phone is available, redirect to gate if not
    if (!buyerPhone) {
      navigate('/');
      return;
    }

    // Load properties
    setProperties(sampleProperties);
    setFilteredProperties(sampleProperties);
  }, [buyerPhone, navigate]);

  useEffect(() => {
    // Apply filters
    let filtered = properties;

    // Type filter
    if (selectedType !== 'All') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    // District filter
    if (selectedDistrict !== 'All') {
      filtered = filtered.filter(p => p.district === selectedDistrict);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.taluka.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(filtered);
  }, [selectedType, selectedDistrict, searchQuery, properties]);

  const getBrokerByEmail = (email) => {
    return sampleBrokers.find(b => b.email === email);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>MH Property Portal</h1>
        </div>

        <div style={styles.headerCenter}>
          <input
            type="text"
            placeholder="Search by title, taluka or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.headerRight}>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={styles.districtSelect}
          >
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          <div style={styles.userInfo}>
            <span style={styles.userName}>👤 {buyerName}</span>
            <span style={styles.phoneDisplay}>{buyerPhone}</span>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div style={styles.filtersBar}>
        <div style={styles.filterPills}>
          {propertyTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                ...styles.filterPill,
                ...(selectedType === type ? styles.filterPillActive : {})
              }}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowMap(!showMap)}
          style={{
            ...styles.mapToggle,
            ...(showMap ? styles.mapToggleActive : {})
          }}
        >
          {showMap ? 'List View' : 'Map View'}
        </button>
      </div>

      {/* Results count */}
      <div style={styles.resultsInfo}>
        {filteredProperties.length} properties found
      </div>

      {/* Property Grid */}
      {!showMap ? (
        <div style={styles.propertiesGrid}>
          {filteredProperties.length === 0 ? (
            <div style={styles.noResults}>
              <p style={styles.noResultsText}>No properties found</p>
              <p style={styles.noResultsSubtext}>Try adjusting your filters</p>
            </div>
          ) : (
            filteredProperties.map(property => {
              const broker = getBrokerByEmail(property.brokerEmail);
              return (
                <div
                  key={property.id}
                  style={styles.card}
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  {/* Card Header */}
                  <div style={styles.cardHeader}>
                    <div style={styles.cardIcon}>{property.icon}</div>
                    <div style={styles.cardBadges}>
                      <span style={styles.typeBadge}>{property.type}</span>
                      <span style={{
                        ...styles.statusBadge,
                        ...(property.status === 'Available' ? styles.statusAvailable :
                          property.status === 'Under Negotiation' ? styles.statusNegotiation :
                            styles.statusSold)
                      }}>
                        {property.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <h3 style={styles.cardTitle}>{property.title}</h3>
                  <p style={styles.cardLocation}>{property.taluka}, {property.district}</p>

                  <div style={styles.cardDetails}>
                    <span style={styles.cardDetail}>{property.area}</span>
                    <span style={styles.cardDetail}>{property.facing} Facing</span>
                  </div>

                  <div style={styles.cardTags}>
                    {property.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} style={styles.tag}>{tag}</span>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div style={styles.cardFooter}>
                    <span style={styles.price}>{property.price}</span>
                    {broker && (
                      <div style={styles.brokerAvatar}>
                        {getInitials(broker.name)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div style={styles.mapView}>
          <p style={styles.mapPlaceholder}>
            Map view coming soon! SVG Maharashtra map will be displayed here.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#faf7f2',
    fontFamily: 'Georgia, serif',
  },
  header: {
    background: 'white',
    padding: '20px 40px',
    borderBottom: '2px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: {
    flex: '0 0 auto',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8b6d38',
    margin: 0,
  },
  headerCenter: {
    flex: '1',
    maxWidth: '500px',
    margin: '0 30px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '15px',
    border: '2px solid #ddd',
    borderRadius: '25px',
    fontFamily: 'Georgia, serif',
    boxSizing: 'border-box',
  },
  headerRight: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  districtSelect: {
    padding: '10px 16px',
    fontSize: '14px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontFamily: 'Georgia, serif',
    background: 'white',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    padding: '10px 18px',
    background: '#f9f5f0',
    color: '#8b6d38',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: '2px solid #d4a574',
  },
  phoneDisplay: {
    padding: '10px 18px',
    background: '#8b6d38',
    color: 'white',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  filtersBar: {
    background: 'white',
    padding: '20px 40px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterPills: {
    display: 'flex',
    gap: '10px',
  },
  filterPill: {
    padding: '10px 20px',
    fontSize: '14px',
    border: '2px solid #ddd',
    background: 'white',
    borderRadius: '20px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    transition: 'all 0.3s',
  },
  filterPillActive: {
    background: '#8b6d38',
    color: 'white',
    borderColor: '#8b6d38',
  },
  mapToggle: {
    padding: '10px 24px',
    fontSize: '14px',
    border: '2px solid #8b6d38',
    background: 'white',
    color: '#8b6d38',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  mapToggleActive: {
    background: '#8b6d38',
    color: 'white',
  },
  resultsInfo: {
    padding: '15px 40px',
    fontSize: '15px',
    color: '#666',
  },
  propertiesGrid: {
    padding: '20px 40px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  cardIcon: {
    fontSize: '40px',
  },
  cardBadges: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'flex-end',
  },
  typeBadge: {
    padding: '4px 12px',
    background: '#f0f0f0',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#666',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  statusAvailable: {
    background: '#e8f5e9',
    color: '#2e7d32',
  },
  statusNegotiation: {
    background: '#fff3e0',
    color: '#ef6c00',
  },
  statusSold: {
    background: '#ffebee',
    color: '#c62828',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#333',
  },
  cardLocation: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 12px 0',
  },
  cardDetails: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
  },
  cardDetail: {
    fontSize: '13px',
    color: '#888',
  },
  cardTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  tag: {
    padding: '4px 10px',
    background: '#f9f5f0',
    border: '1px solid #d4a574',
    borderRadius: '10px',
    fontSize: '11px',
    color: '#8b6d38',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #f0f0f0',
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#8b6d38',
  },
  brokerAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4a574 0%, #8b6d38 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '80px 20px',
  },
  noResultsText: {
    fontSize: '24px',
    color: '#666',
    margin: '0 0 10px 0',
  },
  noResultsSubtext: {
    fontSize: '16px',
    color: '#999',
    margin: 0,
  },
  mapView: {
    padding: '60px 40px',
    textAlign: 'center',
  },
  mapPlaceholder: {
    fontSize: '18px',
    color: '#999',
  },
};
