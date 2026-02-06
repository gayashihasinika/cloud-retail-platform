import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Signup.css';

const API_URL = import.meta.env.VITE_AUTH_API_URL;

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== passwordConfirm) {
      alert("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
        role,
      });

      // Save token & role
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);

      alert('Registration successful! You can now log in.');
      
      // Redirect to login or dashboard based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || 'Something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-full-page">
      <div className="signup-background">
        <div className="signup-card-wrapper">
          <div className="signup-card">
            <div className="signup-header">
              <h1>Create Your Account</h1>
              <p>Join Store Manager and start shopping or managing today</p>
            </div>

            <form onSubmit={handleSignup} className="signup-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input
                  id="passwordConfirm"
                  type="password"
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Account Type</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="customer">Customer (Shop & Buy)</option>
                  <option value="admin">Admin (Manage Store)</option>
                </select>
              </div>

              <button
                type="submit"
                className="signup-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="login-section">
              <p>Already have an account?</p>
              <Link to="/login" className="login-link">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}