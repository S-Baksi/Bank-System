import { Outlet, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Sidebar from './Sidebar';

const titles = {
  '/dashboard': { title: 'Account Summary', subtitle: 'Overview of your accounts and recent activity' },
  '/accounts': { title: 'My Accounts', subtitle: 'Manage your savings, current and other accounts' },
  '/transactions': { title: 'Fund Transfer & Transactions', subtitle: 'NEFT, RTGS, IMPS and account transactions' },
  '/statement': { title: 'Mini Statement', subtitle: 'View and print your account transaction statement' },
  '/audit': { title: 'Audit & Security Logs', subtitle: 'Account activity and security event history' },
  '/profile': { title: 'My Profile', subtitle: 'Personal information and account settings' },
  '/support': { title: 'Help & Support', subtitle: 'FAQs, contact us, and grievance redressal' },
};

export default function Layout() {
  const { pathname } = useLocation();
  const { title, subtitle } = titles[pathname] || { title: 'FinTrack', subtitle: '' };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">{title}</div>
            {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
          </div>
          <div className="topbar-right">
            <div className="topbar-badge">
              <ShieldCheck size={13} />
              Secure Session Active
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
