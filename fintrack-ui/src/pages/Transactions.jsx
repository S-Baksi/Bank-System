import { useState, useEffect } from 'react';
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight, X, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { accountApi, transactionApi } from '../api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);

function TransactionModal({ type, accounts, onClose, onDone }) {
  const [form, setForm] = useState({ fromAccountId: '', toAccountId: '', accountId: '', amount: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const titles = { transfer: 'Transfer Funds', deposit: 'Deposit Money', withdrawal: 'Withdraw Money' };
  const icons = { transfer: <ArrowLeftRight size={18} />, deposit: <ArrowDownLeft size={18} />, withdrawal: <ArrowUpRight size={18} /> };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const amount = parseFloat(form.amount);
      if (type === 'transfer') await transactionApi.transfer({ fromAccountId: +form.fromAccountId, toAccountId: +form.toAccountId, amount, description: form.description });
      else if (type === 'deposit') await transactionApi.deposit({ accountId: +form.accountId, amount, description: form.description });
      else await transactionApi.withdrawal({ accountId: +form.accountId, amount, description: form.description });
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {icons[type]}
            </div>
            <span className="modal-title">{titles[type]}</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error"><AlertCircle size={16} style={{ flexShrink: 0 }} />{error}</div>}

            {type === 'transfer' ? (
              <>
                <div className="form-group">
                  <label className="form-label">From Account *</label>
                  <select className="form-select" value={form.fromAccountId} onChange={e => setForm(f => ({ ...f, fromAccountId: e.target.value }))} required>
                    <option value="">Select account</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.accountName} — {fmt(a.balance)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">To Account *</label>
                  <select className="form-select" value={form.toAccountId} onChange={e => setForm(f => ({ ...f, toAccountId: e.target.value }))} required>
                    <option value="">Select account</option>
                    {accounts.filter(a => a.id !== +form.fromAccountId).map(a => <option key={a.id} value={a.id}>{a.accountName} — {fmt(a.balance)}</option>)}
                  </select>
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Account *</label>
                <select className="form-select" value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))} required>
                  <option value="">Select account</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.accountName} — {fmt(a.balance)}</option>)}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Amount (USD) *</label>
              <input className="form-input" type="number" min="0.01" step="0.01" placeholder="0.00"
                value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
              {type !== 'deposit' && <p className="text-sm text-muted" style={{ marginTop: 4 }}>A $0.50 transaction fee applies.</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" placeholder="Optional note" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : titles[type]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const loadAccounts = async () => {
    try { const res = await accountApi.getAll(); setAccounts(res.data); if (res.data.length > 0 && !selectedAccount) setSelectedAccount(String(res.data[0].id)); }
    catch (_) {}
  };

  const loadTransactions = async (accountId) => {
    if (!accountId) return;
    setLoading(true);
    try { const res = await transactionApi.getHistory(accountId); setTransactions(res.data); }
    catch (_) { setTransactions([]); } finally { setLoading(false); }
  };

  useEffect(() => { loadAccounts(); }, []);
  useEffect(() => { if (selectedAccount) loadTransactions(selectedAccount); }, [selectedAccount]);

  const handleDone = () => {
    setModal(null);
    setToast('Transaction completed successfully!');
    loadAccounts();
    if (selectedAccount) loadTransactions(selectedAccount);
    setTimeout(() => setToast(''), 3000);
  };

  const txTypeColor = (type) => ({ DEPOSIT: 'var(--success)', WITHDRAWAL: 'var(--danger)', TRANSFER: 'var(--primary)' }[type] || 'var(--gray-600)');

  return (
    <div>
      {toast && <div className="alert alert-success" style={{ marginBottom: 20 }}><CheckCircle size={16} />{toast}</div>}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => setModal('transfer')}><ArrowLeftRight size={16} /> Transfer</button>
        <button className="btn btn-success" onClick={() => setModal('deposit')}><ArrowDownLeft size={16} /> Deposit</button>
        <button className="btn btn-danger" onClick={() => setModal('withdrawal')}><ArrowUpRight size={16} /> Withdraw</button>
      </div>

      {/* Account Selector + History */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Transaction History</div>
            <div className="card-subtitle">{transactions.length} records</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select className="form-select" style={{ width: 200 }} value={selectedAccount}
              onChange={e => setSelectedAccount(e.target.value)}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.accountName}</option>)}
            </select>
            <button className="btn btn-secondary btn-sm" onClick={() => loadTransactions(selectedAccount)}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-page"><span className="spinner dark" /></div>
        ) : transactions.length === 0 ? (
          <div className="empty-state"><ArrowLeftRight size={40} /><h3>No transactions</h3><p>Transactions for this account will appear here</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Reference</th>
                  <th>Amount</th>
                  <th>Fee</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className={`tx-icon ${tx.type?.toLowerCase()}`}>
                          {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={13} /> : tx.type === 'WITHDRAWAL' ? <ArrowUpRight size={13} /> : <ArrowLeftRight size={13} />}
                        </div>
                        <span style={{ fontWeight: 500, color: txTypeColor(tx.type) }}>{tx.type}</span>
                      </div>
                    </td>
                    <td className="font-mono" style={{ fontSize: 12, color: 'var(--gray-500)' }}>{tx.referenceNumber}</td>
                    <td style={{ fontWeight: 600, color: tx.type === 'DEPOSIT' ? 'var(--success)' : 'var(--danger)' }}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}{fmt(tx.amount)}
                    </td>
                    <td style={{ color: 'var(--gray-500)' }}>{fmt(tx.transactionFee)}</td>
                    <td style={{ color: 'var(--gray-600)' }}>#{tx.fromAccountId}</td>
                    <td style={{ color: 'var(--gray-600)' }}>{tx.toAccountId ? `#${tx.toAccountId}` : '—'}</td>
                    <td>
                      <span className={`badge badge-${tx.status === 'COMPLETED' ? 'success' : tx.status === 'FAILED' ? 'danger' : tx.status === 'REVERSED' ? 'warning' : 'gray'}`}>
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

      {modal && <TransactionModal type={modal} accounts={accounts} onClose={() => setModal(null)} onDone={handleDone} />}
    </div>
  );
}
