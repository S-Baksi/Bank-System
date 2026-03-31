import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, AlertCircle, CheckCircle } from 'lucide-react';
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
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon"><Building2 size={20} /></div>
          <span>FinTrack</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join FinTrack and manage your finances</p>

        {error && <div className="alert alert-error"><AlertCircle size={16} style={{ flexShrink: 0 }} />{error}</div>}
        {success && <div className="alert alert-success"><CheckCircle size={16} style={{ flexShrink: 0 }} />Account created! Redirecting to login...</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" placeholder="John" value={form.firstName} onChange={set('firstName')} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" placeholder="Doe" value={form.lastName} onChange={set('lastName')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Username <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input className="form-input" placeholder="johndoe" value={form.username} onChange={set('username')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input className="form-input" type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" placeholder="+1 234 567 8900" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="form-group">
            <label className="form-label">Password <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input className="form-input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} required minLength={8} />
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading || success} style={{ marginTop: 8 }}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--gray-500)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
