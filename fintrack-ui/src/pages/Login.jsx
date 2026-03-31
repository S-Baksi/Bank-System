import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ShieldCheck, Landmark, Lock, Globe } from 'lucide-react';
import { authApi } from '../api';
import { useAuth } from '../AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const { token, refreshToken, username } = res.data;
      login({ username }, token);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">FT</div>
          <div>
            <div className="auth-brand-name">FinTrack</div>
            <div className="auth-brand-tagline">Banking &amp; Finance</div>
          </div>
        </div>
        <div className="auth-left-content">
          <div className="auth-left-title">Your Trusted<br />Digital Banking Partner</div>
          <div className="auth-left-desc">
            Secure, fast, and reliable banking at your fingertips. Manage accounts, transfer funds, and track your finances with confidence.
          </div>
          <div className="auth-features">
            {[
              { icon: ShieldCheck, text: '256-bit AES Encrypted Transactions' },
              { icon: Lock, text: 'Multi-factor Authentication' },
              { icon: Globe, text: '24/7 Online Banking Access' },
              { icon: Landmark, text: 'RBI Compliant & Regulated' },
            ].map(({ icon: Icon, text }) => (
              <div className="auth-feature" key={text}>
                <div className="auth-feature-dot" />
                <Icon size={14} style={{ opacity: .7, flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <div className="auth-form-title">Internet Banking Login</div>
            <div className="auth-form-subtitle">Enter your credentials to access your account securely</div>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username / Customer ID</label>
              <input className="form-input" placeholder="Enter your username"
                value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Login Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading} style={{ marginTop: 12 }}>
              {loading ? <span className="spinner" /> : 'Login to Net Banking'}
            </button>
          </form>

          <div className="divider">or</div>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--gray-500)' }}>
            New customer?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Open an Account</Link>
          </p>

          <div style={{ marginTop: 32, padding: '14px 16px', background: 'var(--primary-light)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
              Security Notice
            </div>
            <div style={{ fontSize: 11, color: 'var(--gray-600)', lineHeight: 1.6 }}>
              FinTrack will never ask for your password via email or phone. Always ensure you are on the official website before logging in.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
