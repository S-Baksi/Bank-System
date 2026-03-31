import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, ArrowLeftRight, ShieldCheck, LogOut, HelpCircle, User, FileText } from 'lucide-react';
import { useAuth } from '../AuthContext';

const mainNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: CreditCard, label: 'My Accounts' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/statement', icon: FileText, label: 'Mini Statement' },
];

const secondaryNav = [
  { to: '/audit', icon: ShieldCheck, label: 'Audit Logs' },
  { to: '/profile', icon: User, label: 'My Profile' },
  { to: '/support', icon: HelpCircle, label: 'Help & Support' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">FT</div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-name">FinTrack</div>
          <div className="sidebar-logo-sub">Internet Banking</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Banking Services</div>
        {mainNav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        <div className="nav-section-label" style={{ marginTop: 8 }}>Account & Security</div>
        {secondaryNav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '10px 12px', margin: '0 12px 12px', background: 'rgba(200,150,12,.12)', borderRadius: 8, border: '1px solid rgba(200,150,12,.2)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
          Secure Session
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', lineHeight: 1.5 }}>
          Your session is encrypted and protected.
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
            <div className="user-role">Account Holder</div>
          </div>
          <button onClick={handleLogout} title="Logout"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.4)', padding: 4, borderRadius: 6 }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
