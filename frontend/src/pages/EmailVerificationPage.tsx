import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { auth } from '../services/auth'; // Giả sử bạn sẽ thêm hàm verifyEmail vào auth.ts

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing.');
      return;
    }

    const verify = async () => {
      try {
        await auth.verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div>
      <h1>Email Verification</h1>
      {status === 'verifying' && <p>Verifying your email, please wait...</p>}
      {status === 'success' && (
        <div>
          <p>Your email has been successfully verified!</p>
          <Link to="/login">Click here to log in</Link>
        </div>
      )}
      {status === 'error' && (
        <div>
          <p>Failed to verify email.</p>
          <p><i>{errorMessage}</i></p>
        </div>
      )}
    </div>
  );
}