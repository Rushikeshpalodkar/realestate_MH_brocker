import { useNavigate } from 'react-router-dom';
import { sampleProperties, sampleInterests } from '../../data/sampleProperties';
import AdminLayout from '../../components/AdminLayout';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentBroker = sessionStorage.getItem('currentBroker');

  // Filter properties and interests for current broker
  const myProperties = sampleProperties.filter(p => p.brokerEmail === currentBroker);
  const myInterests = sampleInterests.filter(i => i.brokerEmail === currentBroker);

  // Calculate stats
  const totalProperties = myProperties.length;
  const totalLeads = myInterests.length;
  const availableCount = myProperties.filter(p => p.status === 'Available').length;
  const negotiationCount = myProperties.filter(p => p.status === 'Under Negotiation').length;
  const soldCount = myProperties.filter(p => p.status === 'Sold').length;

  return (
    <AdminLayout>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.subtitle}>Welcome back! Here's your property overview.</p>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏠</div>
          <div style={styles.statValue}>{totalProperties}</div>
          <div style={styles.statLabel}>Total Properties</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statValue}>{totalLeads}</div>
          <div style={styles.statLabel}>Total Leads</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statValue}>{availableCount}</div>
          <div style={styles.statLabel}>Available</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🤝</div>
          <div style={styles.statValue}>{negotiationCount}</div>
          <div style={styles.statLabel}>Under Negotiation</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.actionsSection}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <button
            onClick={() => navigate('/admin/properties/add')}
            style={styles.actionButton}
          >
            <span style={styles.actionIcon}>➕</span>
            <span style={styles.actionText}>Add New Property</span>
          </button>

          <button
            onClick={() => navigate('/admin/buyers')}
            style={styles.actionButton}
          >
            <span style={styles.actionIcon}>👥</span>
            <span style={styles.actionText}>View Leads</span>
          </button>

          <button
            onClick={() => navigate('/admin/properties')}
            style={styles.actionButton}
          >
            <span style={styles.actionIcon}>🏠</span>
            <span style={styles.actionText}>Manage Properties</span>
          </button>
        </div>
      </div>

      {/* Recent Interests */}
      {myInterests.length > 0 && (
        <div style={styles.recentSection}>
          <h2 style={styles.sectionTitle}>Recent Leads</h2>
          <div style={styles.table}>
            {myInterests.slice(-5).reverse().map(interest => (
              <div key={interest.id} style={styles.tableRow}>
                <div style={styles.tableCell}>
                  <strong>{interest.buyerPhone}</strong>
                </div>
                <div style={styles.tableCell}>
                  {interest.propertyTitle}
                </div>
                <div style={styles.tableCell}>
                  {new Date(interest.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const styles = {
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '40px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#8b6d38',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
  },
  actionsSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    color: '#333',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  actionButton: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    border: '2px solid #ddd',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.3s',
  },
  actionIcon: {
    fontSize: '32px',
  },
  actionText: {
    fontWeight: 'bold',
    color: '#333',
  },
  recentSection: {
    marginBottom: '40px',
  },
  table: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr 150px',
    padding: '16px 24px',
    borderBottom: '1px solid #f0f0f0',
  },
  tableCell: {
    fontSize: '15px',
    color: '#555',
  },
};
