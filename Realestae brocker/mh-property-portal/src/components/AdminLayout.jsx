import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const currentBroker = sessionStorage.getItem('currentBroker');
    if (!currentBroker) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('currentBroker');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  const currentBroker = sessionStorage.getItem('currentBroker');

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Admin Portal</h2>
          <p style={styles.sidebarEmail}>{currentBroker}</p>
        </div>

        <nav style={styles.nav}>
          <button
            onClick={() => navigate('/admin/dashboard')}
            style={{
              ...styles.navItem,
              ...(isActive('/admin/dashboard') ? styles.navItemActive : {})
            }}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate('/admin/properties')}
            style={{
              ...styles.navItem,
              ...(isActive('/admin/properties') ? styles.navItemActive : {})
            }}
          >
            🏠 My Properties
          </button>

          <button
            onClick={() => navigate('/admin/properties/add')}
            style={{
              ...styles.navItem,
              ...(isActive('/admin/properties/add') ? styles.navItemActive : {})
            }}
          >
            ➕ Add Property
          </button>

          <button
            onClick={() => navigate('/admin/buyers')}
            style={{
              ...styles.navItem,
              ...(isActive('/admin/buyers') ? styles.navItemActive : {})
            }}
          >
            👥 Interested Buyers
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>

          <button onClick={() => navigate('/')} style={styles.publicButton}>
            View Public Site
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#faf7f2',
    fontFamily: 'Georgia, serif',
  },
  sidebar: {
    width: '280px',
    background: '#8b6d38',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  sidebarHeader: {
    padding: '30px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  sidebarTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  sidebarEmail: {
    fontSize: '13px',
    opacity: 0.8,
    margin: 0,
  },
  nav: {
    flex: 1,
    padding: '20px 0',
  },
  navItem: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '16px',
    textAlign: 'left',
    background: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    borderLeft: '4px solid transparent',
    transition: 'all 0.3s',
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.1)',
    borderLeftColor: 'white',
    fontWeight: 'bold',
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.2)',
  },
  logoutButton: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    marginBottom: '10px',
  },
  publicButton: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
  },
  main: {
    flex: 1,
    padding: '40px',
    overflow: 'auto',
  },
};
