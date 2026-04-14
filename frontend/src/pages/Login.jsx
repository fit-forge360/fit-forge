import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleViewArchitecture = () => {
    window.open("/assets/architecture.png", "_blank");
  };

  const handleViewPPT = () => {
  window.open(
    "https://docs.google.com/presentation/d/1agvdxfPKWsTiHNDWICYU3NybeaYsttO8/preview",
    "_blank"
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const { data } = await api.post(endpoint, form);
      localStorage.setItem('token',  data.token);
      localStorage.setItem('userId', data.userId);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
    {/* 🔥 NEW SECTION (OUTSIDE LOGIN CARD) */}
    <div className="resource-section">
      <button className="btn btn-secondary" onClick={handleViewArchitecture}>
        View Architecture
      </button>

      <button className="btn btn-secondary" onClick={handleViewPPT}>
        View PPT
      </button>
    </div>



      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-icon">🏋️</div>
          <span className="auth-logo-name">FitForge</span>
        </div>

        <h1 className="auth-title">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-subtitle">
          {isSignup
            ? 'Start your fitness journey today.'
            : 'Sign in to continue your progress.'}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="input"
                placeholder="John Doe"
                value={form.name}
                onChange={set('name')}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 6 }}>
            {loading ? 'Please wait…' : (isSignup ? '🚀 Create Account' : '→ Sign In')}
          </button>
        </form>

        <div className="auth-switch">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => { setIsSignup(!isSignup); setError(''); }}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
