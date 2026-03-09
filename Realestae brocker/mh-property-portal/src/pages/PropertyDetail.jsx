import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleProperties, sampleBrokers, sampleInterests } from '../data/sampleProperties';

export default function PropertyDetail({ buyerPhone, buyerName }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [broker, setBroker] = useState(null);
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  useEffect(() => {
    // Check if buyer phone is available
    if (!buyerPhone) {
      navigate('/');
      return;
    }

    // Load property
    const foundProperty = sampleProperties.find(p => p.id === id);
    if (foundProperty) {
      setProperty(foundProperty);
      const foundBroker = sampleBrokers.find(b => b.email === foundProperty.brokerEmail);
      setBroker(foundBroker);

      // Check if interest already submitted
      const existingInterest = sampleInterests.find(
        i => i.propertyId === id && i.buyerPhone === buyerPhone
      );
      if (existingInterest) {
        setInterestSubmitted(true);
      }
    } else {
      navigate('/listings');
    }
  }, [id, buyerPhone, navigate]);

  const handleInterestSubmit = () => {
    if (!property || !broker || interestSubmitted) return;

    // Create interest record
    const interest = {
      id: Date.now().toString(),
      buyerName,
      buyerPhone,
      propertyId: property.id,
      propertyTitle: property.title,
      brokerEmail: broker.email,
      timestamp: new Date()
    };

    sampleInterests.push(interest);
    setInterestSubmitted(true);

    // Navigate to success screen
    navigate('/success');
  };

  if (!property || !broker) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/listings')} style={styles.backButton}>
          ← Back to Listings
        </button>
        <h1 style={styles.logo}>MH Property Portal</h1>
        <div style={styles.userInfo}>
          <span style={styles.userName}>👤 {buyerName}</span>
          <span style={styles.phoneDisplay}>{buyerPhone}</span>
        </div>
      </header>

      <div style={styles.contentWrapper}>
        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Hero Section */}
          <div style={styles.hero}>
            <div style={styles.heroIcon}>{property.icon}</div>
            <div style={styles.heroBadges}>
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

          {/* Title */}
          <h1 style={styles.title}>{property.title}</h1>
          <p style={styles.location}>{property.location}</p>

          {/* Stats Boxes */}
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Price</div>
              <div style={styles.statValue}>{property.price}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Area</div>
              <div style={styles.statValue}>{property.area}</div>
            </div>
            {property.beds && (
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Bedrooms</div>
                <div style={styles.statValue}>{property.beds} BHK</div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div style={styles.tagsSection}>
            {property.tags.map((tag, index) => (
              <span key={index} style={styles.tag}>{tag}</span>
            ))}
          </div>

          {/* Description */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.description}>{property.description}</p>
          </div>

          {/* Property Details */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Property Details</h3>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>District:</span>
                <span style={styles.detailValue}>{property.district}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Taluka:</span>
                <span style={styles.detailValue}>{property.taluka}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Facing:</span>
                <span style={styles.detailValue}>{property.facing}</span>
              </div>
              {property.beds && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Bathrooms:</span>
                  <span style={styles.detailValue}>{property.baths}</span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Address</h3>
            <p style={styles.address}>{property.address}</p>
          </div>

          {/* Mini Map Placeholder */}
          <div style={styles.miniMap}>
            <p style={styles.mapText}>📍 Location: {property.district}, Maharashtra</p>
          </div>
        </div>

        {/* Sticky Broker Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Contact Broker</h3>

            <div style={styles.brokerInfo}>
              <div style={styles.brokerAvatar}>
                {broker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <div style={styles.brokerName}>{broker.name}</div>
                <div style={styles.brokerPhone}>{broker.phone}</div>
              </div>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.buyerPhoneSection}>
              <p style={styles.buyerPhoneLabel}>Your details:</p>
              <p style={styles.buyerNameValue}>👤 {buyerName}</p>
              <p style={styles.buyerPhoneValue}>📞 {buyerPhone}</p>
              <p style={styles.buyerPhoneNote}>
                These details will be shared with the broker when you submit interest
              </p>
            </div>

            <button
              onClick={handleInterestSubmit}
              disabled={interestSubmitted}
              style={{
                ...styles.interestButton,
                ...(interestSubmitted ? styles.interestButtonDisabled : {})
              }}
            >
              {interestSubmitted ? 'Interest Submitted ✓' : 'I\'m Interested'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#faf7f2',
    fontFamily: 'Georgia, serif',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#666',
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
  backButton: {
    padding: '10px 20px',
    fontSize: '14px',
    border: '2px solid #ddd',
    background: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8b6d38',
    margin: 0,
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
  contentWrapper: {
    display: 'flex',
    gap: '30px',
    padding: '30px 40px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  mainContent: {
    flex: '1',
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  heroIcon: {
    fontSize: '80px',
  },
  heroBadges: {
    display: 'flex',
    gap: '10px',
  },
  typeBadge: {
    padding: '8px 16px',
    background: '#f0f0f0',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
  },
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
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
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
    color: '#333',
  },
  location: {
    fontSize: '18px',
    color: '#666',
    margin: '0 0 30px 0',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statBox: {
    padding: '20px',
    background: '#f9f5f0',
    borderRadius: '10px',
    border: '2px solid #d4a574',
  },
  statLabel: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#8b6d38',
  },
  tagsSection: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  tag: {
    padding: '8px 16px',
    background: '#f9f5f0',
    border: '2px solid #d4a574',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#8b6d38',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '30px',
    paddingBottom: '30px',
    borderBottom: '1px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
    color: '#333',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#555',
    margin: 0,
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailLabel: {
    fontSize: '13px',
    color: '#888',
  },
  detailValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
    margin: 0,
  },
  miniMap: {
    padding: '40px',
    background: '#f0f0f0',
    borderRadius: '10px',
    textAlign: 'center',
    marginTop: '30px',
  },
  mapText: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  sidebar: {
    width: '350px',
    position: 'sticky',
    top: '100px',
    alignSelf: 'flex-start',
  },
  sidebarCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    color: '#333',
  },
  brokerInfo: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  brokerAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4a574 0%, #8b6d38 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  brokerName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
  },
  brokerPhone: {
    fontSize: '14px',
    color: '#666',
  },
  divider: {
    height: '1px',
    background: '#e0e0e0',
    margin: '20px 0',
  },
  buyerPhoneSection: {
    marginBottom: '24px',
  },
  buyerPhoneLabel: {
    fontSize: '13px',
    color: '#888',
    margin: '0 0 12px 0',
  },
  buyerNameValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
  },
  buyerPhoneValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  buyerPhoneNote: {
    fontSize: '12px',
    color: '#999',
    lineHeight: '1.5',
    margin: 0,
  },
  interestButton: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #d4a574 0%, #8b6d38 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    transition: 'transform 0.2s',
  },
  interestButtonDisabled: {
    background: '#2e7d32',
    cursor: 'not-allowed',
    opacity: 0.9,
  },
};
