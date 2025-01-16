import{ useState } from 'react';
import './LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLogin) {
      const validationError = validatePassword(password);
      if (validationError) {
        setPasswordError(validationError);
        return;
      }
    }
    const url = isLogin ? 'http://localhost:5001/login' : 'http://localhost:5001/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token || ''); 
        window.location.href = '/';
      } else {
        setError(data.message || 'Request failed');
      }
    } catch (e) {
      setError('An error occurred. Please try again later.' + e);
    }
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || !hasUpperCase || !hasSpecialChar) {
      return 'Password must be at least 6 characters long, contain at least one uppercase letter, and at least one special character.';
    }
    return '';
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (!isLogin) {
              setPasswordError(validatePassword(e.target.value));
            }
          }}
          required
        />
        {!isLogin && passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}

        <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </button>
    </div>
  );
}

export default LoginPage;
