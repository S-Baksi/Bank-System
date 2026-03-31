import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { accountApi, transactionApi } from '../api';
import { useAuth } from '../AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);

const accountColors = { SAVINGS: 'savings', CHECKING: 'checking', BUSINESS: 'business', INVESTMENT: 'investment' };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const accRes = await accountApi.getAll();
        setAccounts(accRes.data);
        if (accRes.data.length > 0) {
          const txRes = await transactionApi.getHistory(accRes.data[0].id);
          setTransactions(txRes.data.slice(0, 8));
        }
      } catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);
  const deposits = transactions.filter(t => t.type === 'DEPOSIT').reduce((s, t) => s + (t.amount || 0), 0);
  const withdrawals = transactions.filter(t => t.type === 'WITHDRAWAL').reduce((s, t) => s + (t.amount || 0), 0);

  // Build simple chart data from last 7 transactions
  const chartData = [...transactions].reverse().slice(0, 7).map((t, i) => ({
    name: `T${i + 1}`,
    amount: t.amount,
  }));

  if (loading) return <div className="loading-page"><span className="spinner dark" /></div>;

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>
          Good day, {user?.username} 👋
        </h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 2 }}>Here's what's happening with your finances today.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Wallet size={20} /></div>
          <div>
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">{fmt(totalBalance)}</div>
            <div className="stat-change up">↑ Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><TrendingUp size={20} /></div>
          <div>
            <div className="stat-label">Total Deposits</div>
            <div className="stat-value">{fmt(deposits)}</div>
            <div className="stat-change up">Recent activity</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><TrendingDown size={20} /></div>
          <div>
            <div className="stat-label">Total Withdrawals</div>
            <div className="stat-value">{fmt(withdrawals)}</div>
            <div className="stat-change down">Recent activity</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><ArrowLeftRight size={20} /></div>
          <div>
            <div className="stat-label">Transactions</div>
            <div className="stat-value">{transactions.length}</div>
            <div className="stat-change" style={{ color: 'var(--gray-500)' }}>Recent records</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Accounts */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">My Accounts</div>
              <div className="card-subtitle">{accounts.length} active account{accounts.length !== 1 ? 's' : ''}</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/accounts')}>
              <Plus size={14} /> New
            </button>
          </div>
          <div className="card-body" style={{ padding: '16px' }}>
            {accounts.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 20px' }}>
                <Wallet size={32} />
                <h3>No accounts yet</h3>
                <p>Create your first account to get started</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {accounts.map(acc => (
                  <div key={acc.id} className={`account-card ${accountColors[acc.accountType] || 'savings'}`}
                    onClick={() => navigate('/accounts')} style={{ padding: '16px 18px' }}>
                    <div className="account-type">{acc.accountType}</div>
                    <div className="account-number">{acc.accountNumber}</div>
                    <div className="account-balance">{fmt(acc.balance)}</div>
                    <div className="account-name">{acc.accountName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Transaction Activity</div>
              <div className="card-subtitle">Recent transaction amounts</div>
            </div>
          </div>
          <div className="card-body">
            {chartData.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <ArrowLeftRight size={32} />
                <h3>No transactions yet</h3>
                <p>Your activity chart will appear here</p>
              </div>
            ) : (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1a56db" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                    <Tooltip formatter={v => [fmt(v), 'Amount']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                    <Area type="monotone" dataKey="amount" stroke="#1a56db" strokeWidth={2} fill="url(#colorAmt)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Transactions</div>
            <div className="card-subtitle">Latest activity on your primary account</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/transactions')}>View All</button>
        </div>
        {transactions.length === 0 ? (
          <div className="empty-state"><ArrowLeftRight size={32} /><h3>No transactions</h3><p>Your transactions will appear here</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Reference</th>
                  <th>Amount</th>
                  <th>Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className={`tx-icon ${tx.type?.toLowerCase()}`}>
                          {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={14} /> : tx.type === 'WITHDRAWAL' ? <ArrowUpRight size={14} /> : <ArrowLeftRight size={14} />}
                        </div>
                        <span style={{ fontWeight: 500 }}>{tx.type}</span>
                      </div>
                    </td>
                    <td className="font-mono" style={{ fontSize: 12, color: 'var(--gray-500)' }}>{tx.referenceNumber}</td>
                    <td style={{ fontWeight: 600, color: tx.type === 'DEPOSIT' ? 'var(--success)' : 'var(--danger)' }}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}{fmt(tx.amount)}
                    </td>
                    <td style={{ color: 'var(--gray-500)' }}>{fmt(tx.transactionFee)}</td>
                    <td>
                      <span className={`badge badge-${tx.status === 'COMPLETED' ? 'success' : tx.status === 'FAILED' ? 'danger' : 'warning'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
