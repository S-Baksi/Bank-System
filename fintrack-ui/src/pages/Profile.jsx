import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Calendar, CreditCard, BadgeCheck, Lock, AlertTriangle } from 'lucide-react';
import { userApi, accountApi } from '../api';
import { useAuth } from '../AuthContext';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n ?? 0);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--gray-100)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color="var(--primary)" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-800)' }}>{value || '—'}</div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userApi.getProfile(), accountApi.getAll()])
      .then(([pRes, aRes]) => { setProfile(pRes.data); setAccounts(aRes.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><span className="spinner dark" /></div>;

  const initials = profile?.username?.slice(0, 2).toUpperCase() || 'U';
  const totalBalance = accounts.reduce((s, a) => s + (parseFloat(a.balance) || 0), 0);
  const activeAccounts = accounts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div>
      {/* Profile Header Card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)', borderRadius: '12px 12px 0 0', padding: '32px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: 'white', flexShrink: 0, border: '3px solid rgba(255,255,255,.3)' }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>
              {profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : profile?.username}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 4 }}>@{profile?.username}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, background: 'var(--gold)', color: 'white', letterSpacing: '.04em' }}>
                {profile?.role || 'CUSTOMER'}
              </span>
              {profile?.mfaEnabled && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, background: 'rgba(255,255,255,.15)', color: 'white' }}>
                  MFA Enabled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--gray-100)' }}>
          {[
            { label: 'Total Balance', value: fmt(totalBalance), icon: CreditCard },
            { label: 'Active Accounts', value: activeAccounts, icon: BadgeCheck },
            { label: 'Member Since', value: fmtDate(profile?.memberSince), icon: Calendar },
          ].map(({ label, value, icon: Icon }, i) => (
            <div key={label} style={{ padding: '18px 22px', borderRight: i < 2 ? '1px solid var(--gray-100)' : 'none', textAlign: 'center' }}>
              <Icon size={18} color="var(--primary)" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* Personal Information */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Personal Information</div>
              <div className="card-subtitle">Your registered account details</div>
            </div>
          </div>
          <div className="card-body">
            <InfoRow icon={User} label="Full Name" value={profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : profile?.username} />
            <InfoRow icon={Mail} label="Email Address" value={profile?.email} />
            <InfoRow icon={Phone} label="Mobile Number" value={profile?.phone} />
            <InfoRow icon={Shield} label="Customer ID" value={`CUST${String(profile?.id || '').padStart(6, '0')}`} />
            <InfoRow icon={Calendar} label="Account Opened" value={fmtDate(profile?.memberSince)} />
          </div>
        </div>

        {/* Security & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Security Settings</div>
            </div>
            <div className="card-body">
              {[
                { icon: Lock, label: 'Login Password', desc: 'Last changed recently', status: 'Active', ok: true },
                { icon: Shield, label: 'Two-Factor Authentication', desc: profile?.mfaEnabled ? 'Enabled via authenticator app' : 'Not enabled — recommended', status: profile?.mfaEnabled ? 'Enabled' : 'Disabled', ok: profile?.mfaEnabled },
                { icon: BadgeCheck, label: 'Account Verification', desc: accounts.some(a => a.verified) ? 'Account is verified' : 'Pending verification', status: accounts.some(a => a.verified) ? 'Verified' : 'Pending', ok: accounts.some(a => a.verified) },
              ].map(({ icon: Icon, label, desc, status, ok }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: ok ? 'var(--success-light)' : 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={ok ? 'var(--success)' : 'var(--warning)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>{desc}</div>
                  </div>
                  <span className={`badge badge-${ok ? 'success' : 'warning'}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notice */}
          <div style={{ padding: '16px 18px', background: 'var(--primary-light)', borderRadius: 10, borderLeft: '4px solid var(--primary)', display: 'flex', gap: 12 }}>
            <AlertTriangle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>Important Notice</div>
              <div style={{ fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                Never share your login credentials, OTP, or PIN with anyone — including bank employees. FinTrack will never ask for your password.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Accounts */}
      {accounts.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header">
            <div className="card-title">Linked Accounts</div>
            <div className="card-subtitle">{accounts.length} account{accounts.length !== 1 ? 's' : ''} linked to your profile</div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>Account Number</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.id}>
                    <td style={{ fontWeight: 600 }}>{acc.accountName}</td>
                    <td className="font-mono" style={{ fontSize: 12, color: 'var(--gray-500)' }}>{acc.accountNumber}</td>
                    <td><span className="badge badge-primary">{acc.accountType}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{fmt(acc.balance)}</td>
                    <td><span className={`badge badge-${acc.status === 'ACTIVE' ? 'success' : 'warning'}`}>{acc.status}</span></td>
                    <td><span className={`badge badge-${acc.verified ? 'success' : 'gray'}`}>{acc.verified ? 'Yes' : 'No'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
