import { useNavigate } from 'react-router-dom';

export default function SuccessScreen({ buyerName }) {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.checkmark}>✓</div>

        <h1 style={styles.title}>Thank you{buyerName ? `, ${buyerName}` : ''}!</h1>
        <h2 style={styles.subtitle}>Interest Submitted Successfully</h2>

        <p style={styles.message}>
          The broker will contact you on your registered mobile number shortly.
        </p>

        <p style={styles.submessage}>
          Please keep your phone handy. The broker typically responds within 24 hours.
        </p>

        <button
          onClick={() => navigate('/listings')}
          style={styles.button}
        >
          Browse More Properties
        </button>

        <button
          onClick={() => navigate('/')}
          style={styles.secondaryButton}
        >
          Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#faf7f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Georgia, serif',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '60px 40px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  checkmark: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#2e7d32',
    color: 'white',
    fontSize: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 30px auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: 'normal',
    color: '#666',
    margin: '0 0 24px 0',
  },
  message: {
    fontSize: '18px',
    color: '#555',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
  },
  submessage: {
    fontSize: '15px',
    color: '#888',
    lineHeight: '1.6',
    margin: '0 0 40px 0',
  },
  button: {
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
    marginBottom: '12px',
  },
  secondaryButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#8b6d38',
    background: 'white',
    border: '2px solid #8b6d38',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
  },
};
