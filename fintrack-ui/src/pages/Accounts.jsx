import { useState, useEffect } from 'react';
import { Plus, Wallet, X, AlertCircle, CheckCircle } from 'lucide-react';
import { accountApi } from '../api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const accountColors = { SAVINGS: 'savings', CHECKING: 'checking', BUSINESS: 'business', INVESTMENT: 'investment' };

function CreateAccountModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ accountName: '', accountType: 'SAVINGS', initialBalance: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await accountApi.create({ ...form, initialBalance: parseFloat(form.initialBalance) || 0 });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Open New Account</span>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error"><AlertCircle size={16} />{error}</div>}
            <div className="form-group">
              <label className="form-label">Account Name <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input className="form-input" placeholder="e.g. My Savings" value={form.accountName}
                onChange={e => setForm(f => ({ ...f, accountName: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Account Type <span style={{ color: 'var(--danger)' }}>*</span></label>
              <select className="form-select" value={form.accountType}
                onChange={e => setForm(f => ({ ...f, accountType: e.target.value }))}>
                <option value="SAVINGS">Savings</option>
                <option value="CHECKING">Checking</option>
                <option value="BUSINESS">Business</option>
                <option value="INVESTMENT">Investment</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Initial Deposit (USD)</label>
              <input className="form-input" type="number" min="0" step="0.01" placeholder="0.00"
                value={form.initialBalance} onChange={e => setForm(f => ({ ...f, initialBalance: e.target.value }))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : <><Plus size={15} /> Open Account</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');

  const load = async () => {
    setLoading(true);
    try { const res = await accountApi.getAll(); setAccounts(res.data); }
    catch (_) {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreated = () => {
    setShowModal(false);
    setToast('Account created successfully!');
    load();
    setTimeout(() => setToast(''), 3000);
  };

  if (loading) return <div className="loading-page"><span className="spinner dark" /></div>;

  return (
    <div>
      {toast && <div className="alert alert-success" style={{ marginBottom: 20 }}><CheckCircle size={16} />{toast}</div>}

      <div className="flex-between mb-4">
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>{accounts.length} Account{accounts.length !== 1 ? 's' : ''}</h2>
          <p className="text-muted text-sm">Manage all your bank accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Open Account
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: '80px 20px' }}>
            <Wallet size={48} />
            <h3>No accounts yet</h3>
            <p>Open your first account to start banking</p>
            <button className="btn btn-primary mt-4" onClick={() => setShowModal(true)}><Plus size={15} /> Open Account</button>
          </div>
        </div>
      ) : (
        <>
          <div className="accounts-grid">
            {accounts.map(acc => (
              <div key={acc.id} className={`account-card ${accountColors[acc.accountType] || 'savings'}`}
                onClick={() => setSelected(selected?.id === acc.id ? null : acc)}>
                <div className="account-type">{acc.accountType}</div>
                <div className="account-number">{acc.accountNumber}</div>
                <div className="account-balance">{fmt(acc.balance)}</div>
                <div className="account-name">{acc.accountName}</div>
                <div className="account-status">{acc.status}</div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="card mt-6">
              <div className="card-header">
                <div>
                  <div className="card-title">Account Details</div>
                  <div className="card-subtitle">{selected.accountName}</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Close</button>
              </div>
              <div className="card-body">
                <div className="grid-2">
                  {[
                    ['Account Number', selected.accountNumber],
                    ['Account Name', selected.accountName],
                    ['Type', selected.accountType],
                    ['Balance', fmt(selected.balance)],
                    ['Status', selected.status],
                    ['Verified', selected.verified ? 'Yes' : 'No'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                      <div className="text-sm text-muted" style={{ marginBottom: 4 }}>{label}</div>
                      <div style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showModal && <CreateAccountModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
    </div>
  );
}
