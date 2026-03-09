import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GateScreen({ setBuyerPhone, setBuyerName }) {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'verifying'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();
  const otpInputRefs = useRef([]);

  const OTP_API_BASE = 'http://localhost:3003/api';

  // Validate Indian phone number
  const validatePhoneNumber = (phoneNum) => {
    const cleanPhone = phoneNum.replace(/\s/g, '');
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    return indianPhoneRegex.test(cleanPhone);
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    // Validate name
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    // Validate phone
    if (!validatePhoneNumber(phone)) {
      setError('Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${OTP_API_BASE}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSessionId(data.sessionId);
        setStep('otp');
        setError('');
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP input keydown
  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      // Verify OTP with 2Factor.in
      const verifyResponse = await fetch(`${OTP_API_BASE}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          otp: otpCode,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok && verifyData.success) {
        // Send email notification to broker
        try {
          await fetch(`${OTP_API_BASE}/notify-broker`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userName: name,
              userPhone: `+91${phone}`,
              verifiedAt: new Date().toISOString(),
            }),
          });
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
        }

        // Set user data and navigate to listings
        setBuyerPhone(`+91${phone}`);
        setBuyerName(name);

        // Show success briefly, then navigate
        setStep('verifying');
        setTimeout(() => {
          navigate('/listings');
        }, 1500);
      } else {
        setError(verifyData.error || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Failed to verify OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${OTP_API_BASE}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSessionId(data.sessionId);
        setError('');
        otpInputRefs.current[0]?.focus();
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const propertyTypes = [
    '🌾 Agricultural Land',
    '🏗️ NA Plots',
    '🏠 Independent Houses',
    '🏢 Flats & Apartments',
    '🏪 Commercial Properties'
  ];

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.branding}>
          <h1 style={styles.brandTitle}>MH Property Portal</h1>
          <p style={styles.brandSubtitle}>Maharashtra's Trusted Real Estate Platform</p>
        </div>

        <div style={styles.typesList}>
          <h3 style={styles.typesTitle}>Browse Properties:</h3>
          {propertyTypes.map((type, index) => (
            <div key={index} style={styles.typeItem}>
              {type}
            </div>
          ))}
        </div>

        <p style={styles.footerText}>
          Connecting buyers with trusted brokers across Maharashtra
        </p>
      </div>

      {/* Right Panel - OTP Verification */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Welcome</h2>

          {step === 'phone' && (
            <>
              <p style={styles.formSubtitle}>
                Please verify your phone number to browse properties
              </p>

              <form onSubmit={handleSendOTP} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your full name"
                    style={styles.input}
                    disabled={loading}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Mobile Number *</label>
                  <div style={styles.phoneInputContainer}>
                    <span style={styles.countryCode}>+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                        setError('');
                      }}
                      placeholder="9876543210"
                      style={styles.phoneInput}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {error && <p style={styles.errorText}>{error}</p>}

                <button type="submit" style={styles.submitButton} disabled={loading}>
                  {loading ? 'Sending OTP...' : '📲 Send OTP'}
                </button>

                <p style={styles.privacyNote}>
                  You'll receive a 6-digit OTP via SMS to verify your number
                </p>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <p style={styles.formSubtitle}>
                Enter the OTP sent to +91 {phone}
              </p>

              <div style={styles.otpInfo}>
                <p style={styles.nameDisplay}>👤 {name}</p>
              </div>

              <form onSubmit={handleVerifyOTP} style={styles.form}>
                <div style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="tel"
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      maxLength="1"
                      style={styles.otpInput}
                      disabled={loading}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {error && <p style={styles.errorText}>{error}</p>}

                <button type="submit" style={styles.submitButton} disabled={loading}>
                  {loading ? 'Verifying...' : '✅ Verify & Continue'}
                </button>

                <div style={styles.actionButtons}>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    style={styles.linkButton}
                    disabled={loading}
                  >
                    🔄 Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    style={styles.linkButton}
                    disabled={loading}
                  >
                    ← Back
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 'verifying' && (
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>✅</div>
              <h3 style={styles.successTitle}>Verified!</h3>
              <p style={styles.successMessage}>
                Welcome, <strong>{name}</strong>!
              </p>
              <p style={styles.successNote}>
                Taking you to properties...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Georgia, serif',
  },
  leftPanel: {
    flex: '1',
    background: '#8b6d38',
    color: 'white',
    padding: '60px 50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  branding: {
    marginBottom: '40px',
  },
  brandTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    lineHeight: '1.2',
  },
  brandSubtitle: {
    fontSize: '18px',
    opacity: '0.9',
    margin: '0',
  },
  typesList: {
    flex: '1',
  },
  typesTitle: {
    fontSize: '22px',
    marginBottom: '20px',
    fontWeight: 'normal',
  },
  typeItem: {
    fontSize: '20px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  footerText: {
    fontSize: '14px',
    opacity: '0.8',
    marginTop: '40px',
  },
  rightPanel: {
    flex: '1',
    background: '#faf7f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  formCard: {
    background: 'white',
    padding: '50px 40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '450px',
    width: '100%',
  },
  formTitle: {
    fontSize: '32px',
    margin: '0 0 10px 0',
    color: '#333',
  },
  formSubtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  form: {
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '24px',
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
    transition: 'border-color 0.3s',
  },
  phoneInputContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #ddd',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  countryCode: {
    padding: '14px 16px',
    background: '#f5f5f5',
    fontWeight: 'bold',
    color: '#333',
    borderRight: '2px solid #ddd',
    fontSize: '16px',
  },
  phoneInput: {
    flex: 1,
    padding: '14px 16px',
    fontSize: '16px',
    border: 'none',
    fontFamily: 'Georgia, serif',
    outline: 'none',
  },
  otpInfo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  nameDisplay: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#8b6d38',
    margin: '0',
  },
  otpContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  otpInput: {
    width: '50px',
    height: '60px',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontFamily: 'Georgia, serif',
    outline: 'none',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #d4a574 0%, #8b6d38 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    transition: 'transform 0.2s',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px',
  },
  linkButton: {
    padding: '8px 16px',
    fontSize: '14px',
    color: '#8b6d38',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    textDecoration: 'underline',
  },
  privacyNote: {
    fontSize: '13px',
    color: '#888',
    textAlign: 'center',
    lineHeight: '1.5',
    marginTop: '16px',
  },
  successContainer: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  successIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: '15px',
  },
  successMessage: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '10px',
  },
  successNote: {
    fontSize: '16px',
    color: '#666',
    marginTop: '20px',
    padding: '20px',
    background: '#f0f4ff',
    borderRadius: '8px',
    border: '2px dashed #8b6d38',
  },
};
