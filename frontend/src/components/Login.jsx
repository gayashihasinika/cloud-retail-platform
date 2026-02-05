import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://3.80.89.170:8000/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      setToken(token);

      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'customer') {
        navigate('/customer-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || 'Something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-full-page">
      <div className="login-background">
        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Sign in to continue</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="signup-section">
              <p>Don't have an account?</p>
              <Link to="/signup" className="signup-link">
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}