import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const titles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your finances' },
  '/accounts': { title: 'Accounts', subtitle: 'Manage your bank accounts' },
  '/transactions': { title: 'Transactions', subtitle: 'Transfer, deposit & withdraw' },
  '/audit': { title: 'Audit Logs', subtitle: 'Security & activity logs' },
};

export default function Layout() {
  const { pathname } = useLocation();
  const { title, subtitle } = titles[pathname] || { title: 'FinTrack', subtitle: '' };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
