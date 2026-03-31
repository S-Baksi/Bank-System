import { NavLink, useNavigate } from 'react-router-dom';
import { Building2, LayoutDashboard, CreditCard, ArrowLeftRight, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: CreditCard, label: 'Accounts' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/audit', icon: ShieldCheck, label: 'Audit Logs' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><Building2 size={18} /></div>
        <span>FinTrack</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
            <div className="user-role">Customer</div>
          </div>
          <button onClick={handleLogout} title="Logout"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', padding: 4, borderRadius: 6 }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
