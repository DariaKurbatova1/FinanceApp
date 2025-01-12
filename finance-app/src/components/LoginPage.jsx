import{ useState } from 'react';
import './LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
          onChange={(e) => setPassword(e.target.value)}
          required
        />

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
