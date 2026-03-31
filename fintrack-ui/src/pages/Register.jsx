import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, UserPlus, ShieldCheck } from 'lucide-react';
import { authApi } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', firstName: '', lastName: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <div className="auth-left-title">Open Your Account<br />in Minutes</div>
          <div className="auth-left-desc">
            Join thousands of customers who trust FinTrack for their daily banking needs. Simple, secure, and always available.
          </div>
          <div className="auth-features">
            {[
              'Zero account opening charges',
              'Instant account activation',
              'Free NEFT / RTGS transfers',
              'Dedicated customer support',
            ].map(text => (
              <div className="auth-feature" key={text}>
                <div className="auth-feature-dot" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-wrap" style={{ maxWidth: 420 }}>
          <div className="auth-form-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <UserPlus size={20} color="var(--primary)" />
              <div className="auth-form-title" style={{ marginBottom: 0 }}>New Account Registration</div>
            </div>
            <div className="auth-form-subtitle">Fill in your details to create your banking account</div>
          </div>

          {error && <div className="alert alert-error"><AlertCircle size={15} style={{ flexShrink: 0 }} />{error}</div>}
          {success && <div className="alert alert-success"><CheckCircle size={15} style={{ flexShrink: 0 }} />Account created successfully! Redirecting to login...</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" placeholder="First name" value={form.firstName} onChange={set('firstName')} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" placeholder="Last name" value={form.lastName} onChange={set('lastName')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Username / Customer ID <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input className="form-input" placeholder="Choose a username" value={form.username} onChange={set('username')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="form-group">
              <label className="form-label">Set Password <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input className="form-input" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={set('password')} required minLength={8} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16, padding: '10px 12px', background: 'var(--gold-light)', borderRadius: 6, borderLeft: '3px solid var(--gold)' }}>
              <ShieldCheck size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 11, color: 'var(--gray-600)', lineHeight: 1.5 }}>
                Your data is protected with bank-grade 256-bit encryption.
              </span>
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading || success} style={{ marginTop: 4 }}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--gray-500)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Login to Net Banking</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
