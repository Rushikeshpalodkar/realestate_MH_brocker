'use client';

import { useState, useRef } from 'react';

export default function OTPVerification() {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'success'
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [verifiedAt, setVerifiedAt] = useState(null);

  const otpInputRefs = useRef([]);

  // Validate Indian phone number
  const validatePhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/\s/g, '');
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
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
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
      const verifyResponse = await fetch('/api/verify-otp', {
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
        const timestamp = new Date().toISOString();
        setVerifiedAt(timestamp);

        // Send email notification to broker
        try {
          await fetch('/api/notify-broker', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userName: name,
              userPhone: `+91${phoneNumber}`,
              verifiedAt: timestamp,
            }),
          });
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Continue anyway - OTP is verified
        }

        // Redirect to MH Property Portal with user data
        // Wait 2 seconds to show success, then redirect
        setTimeout(() => {
          window.location.href = `http://localhost:5173?name=${encodeURIComponent(name)}&phone=${encodeURIComponent('+91' + phoneNumber)}`;
        }, 2000);

        setStep('success');
        setError('');
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
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
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

  // Go back to phone entry
  const handleBackToPhone = () => {
    setOtp(['', '', '', '', '', '']);
    setStep('phone');
    setError('');
    setSessionId(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 OTP Verification</h1>
        <p style={styles.subtitle}>Secure phone verification for Indian users</p>
        <p style={styles.provider}>Powered by 2Factor.in</p>

        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {/* Phone Number Step */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>👤 Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                style={styles.input}
                disabled={loading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>📱 Phone Number</label>
              <div style={styles.phoneInputContainer}>
                <span style={styles.countryCode}>+91</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  style={styles.phoneInput}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? '⏳ Sending...' : '📲 Send OTP'}
            </button>
          </form>
        )}

        {/* OTP Input Step */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} style={styles.form}>
            <div style={styles.otpInfo}>
              <p>OTP sent to <strong>+91 {phoneNumber}</strong></p>
              <p style={styles.nameDisplay}>👤 {name}</p>
            </div>

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

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? '⏳ Verifying...' : '✅ Verify OTP'}
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
                onClick={handleBackToPhone}
                style={styles.linkButton}
                disabled={loading}
              >
                ← Back
              </button>
            </div>
          </form>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div style={styles.success}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successTitle}>Verification Successful!</h2>
            <p style={styles.successMessage}>
              Welcome, <strong>{name}</strong>!
            </p>
            <p style={styles.successMessage}>
              Your phone number <strong>+91 {phoneNumber}</strong> has been verified.
            </p>
            <p style={styles.successNote}>
              📧 The broker has been notified via email about your verification.
            </p>
            <p style={styles.redirectMessage}>
              🏠 Redirecting you to MH Property Portal...
            </p>
            <p style={styles.redirectNote}>
              You will be automatically logged in and can start browsing properties!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '5px',
    textAlign: 'center',
  },
  provider: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '30px',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #fcc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  phoneInputContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  countryCode: {
    padding: '15px',
    background: '#f5f5f5',
    fontWeight: '600',
    color: '#333',
    borderRight: '2px solid #e0e0e0',
  },
  phoneInput: {
    flex: 1,
    padding: '15px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
  },
  otpInfo: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  nameDisplay: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#667eea',
    marginTop: '5px',
  },
  otpContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  otpInput: {
    width: '50px',
    height: '60px',
    fontSize: '24px',
    fontWeight: '700',
    textAlign: 'center',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
  },
  button: {
    padding: '15px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  linkButton: {
    padding: '10px',
    fontSize: '14px',
    color: '#667eea',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  success: {
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#4caf50',
    marginBottom: '15px',
  },
  successMessage: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '10px',
  },
  successNote: {
    fontSize: '14px',
    color: '#666',
    marginTop: '20px',
    marginBottom: '20px',
    padding: '15px',
    background: '#e8f5e9',
    borderRadius: '10px',
  },
  redirectMessage: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
    marginTop: '10px',
    padding: '20px',
    background: '#f0f4ff',
    borderRadius: '10px',
    border: '2px dashed #667eea',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  redirectNote: {
    fontSize: '14px',
    color: '#888',
    marginTop: '10px',
    fontStyle: 'italic',
  },
};
