export const metadata = {
  title: 'OTP Verification - Indian Phone Auth',
  description: 'Secure OTP verification system for Indian users with email broker notifications',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
