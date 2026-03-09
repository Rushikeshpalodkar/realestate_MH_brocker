import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // For now, simple hardcoded login (will be replaced with Firebase Auth in Phase 3)
    if (email === 'broker1@example.com' && password === 'password') {
      // Store logged-in user in sessionStorage
      sessionStorage.setItem('currentBroker', email);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Broker Login</h1>
        <p style={styles.subtitle}>MH Property Portal Admin</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.note}>
          Demo credentials: broker1@example.com / password
        </p>
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
    padding: '50px 40px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    maxWidth: '450px',
    width: '100%',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '40px',
    textAlign: 'center',
  },
  form: {
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontFamily: 'Georgia, serif',
    boxSizing: 'border-box',
  },
  error: {
    color: '#d32f2f',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
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
  },
  note: {
    fontSize: '13px',
    color: '#888',
    textAlign: 'center',
    lineHeight: '1.5',
    margin: '20px 0 0 0',
  },
};
