import { useState, useEffect, useRef } from 'react';
import { Printer, RefreshCw, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, FileText } from 'lucide-react';
import { accountApi, transactionApi } from '../api';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n ?? 0);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtDateTime = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const accountColors = { SAVINGS: 'savings', CHECKING: 'checking', BUSINESS: 'business', INVESTMENT: 'investment' };

export default function MiniStatement() {
  const [accounts, setAccounts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const printRef = useRef();

  useEffect(() => {
    accountApi.getAll().then(res => {
      setAccounts(res.data);
      if (res.data.length > 0) setSelectedId(String(res.data[0].id));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    transactionApi.getHistory(selectedId)
      .then(res => setTransactions(res.data))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [selectedId]);

  const selectedAccount = accounts.find(a => String(a.id) === selectedId);

  const filtered = transactions.filter(tx => {
    if (filter === 'credit') return tx.type === 'DEPOSIT';
    if (filter === 'debit') return tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER';
    return true;
  });

  const totalCredit = transactions.filter(t => t.type === 'DEPOSIT').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const totalDebit = transactions.filter(t => t.type !== 'DEPOSIT').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Mini Statement - FinTrack</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #1e2438; margin: 20px; }
        h1 { font-size: 18px; color: #003087; margin-bottom: 4px; }
        .sub { color: #636d87; font-size: 11px; margin-bottom: 16px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; padding: 12px; background: #f7f8fc; border: 1px solid #dde1ed; border-radius: 6px; }
        .info-item label { font-size: 10px; color: #636d87; text-transform: uppercase; letter-spacing: .04em; display: block; }
        .info-item span { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { background: #e6edf8; color: #003087; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; padding: 8px 10px; text-align: left; border-bottom: 2px solid #003087; }
        td { padding: 8px 10px; border-bottom: 1px solid #eef0f6; font-size: 11px; }
        .credit { color: #0a7c4e; font-weight: 700; }
        .debit { color: #c0392b; font-weight: 700; }
        .footer { margin-top: 20px; font-size: 10px; color: #636d87; border-top: 1px solid #dde1ed; padding-top: 10px; }
        .summary { display: flex; gap: 20px; margin: 12px 0; }
        .summary-box { flex: 1; padding: 10px; border: 1px solid #dde1ed; border-radius: 4px; }
        .summary-box label { font-size: 10px; color: #636d87; text-transform: uppercase; display: block; }
        .summary-box span { font-size: 14px; font-weight: 700; }
      </style></head><body>${content}
      <div class="footer">Generated on ${new Date().toLocaleString('en-IN')} &nbsp;|&nbsp; FinTrack Internet Banking &nbsp;|&nbsp; This is a computer-generated statement.</div>
      </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div>
      {/* Controls */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="form-label">Select Account</label>
            <select className="form-select" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.accountName} — {a.accountNumber}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Transaction Type</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['all', 'All'], ['credit', 'Credits'], ['debit', 'Debits']].map(([val, label]) => (
                <button key={val} className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(val)}>{label}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => selectedId && transactionApi.getHistory(selectedId).then(r => setTransactions(r.data))}>
            <RefreshCw size={14} />
          </button>
          <button className="btn btn-primary" onClick={handlePrint} disabled={!selectedAccount || filtered.length === 0}>
            <Printer size={15} /> Print Statement
          </button>
        </div>
      </div>

      {/* Account Card */}
      {selectedAccount && (
        <div className={`account-card ${accountColors[selectedAccount.accountType] || 'savings'}`} style={{ marginBottom: 20, cursor: 'default' }}>
          <div className="account-type">{selectedAccount.accountType} Account</div>
          <div className="account-number">{selectedAccount.accountNumber}</div>
          <div className="account-balance">{fmt(selectedAccount.balance)}</div>
          <div className="account-name">{selectedAccount.accountName}</div>
          <div className="account-status">{selectedAccount.status}</div>
        </div>
      )}

      {/* Summary */}
      {transactions.length > 0 && (
        <div className="stats-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <div className="stat-icon green"><ArrowDownLeft size={20} /></div>
            <div>
              <div className="stat-label">Total Credits</div>
              <div className="stat-value" style={{ color: 'var(--success)' }}>{fmt(totalCredit)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red"><ArrowUpRight size={20} /></div>
            <div>
              <div className="stat-label">Total Debits</div>
              <div className="stat-value" style={{ color: 'var(--danger)' }}>{fmt(totalDebit)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><ArrowLeftRight size={20} /></div>
            <div>
              <div className="stat-label">Total Transactions</div>
              <div className="stat-value">{transactions.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Statement */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Account Statement</div>
            <div className="card-subtitle">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        <div ref={printRef}>
          {/* Print Header (visible only in print) */}
          <div style={{ display: 'none' }} className="print-header">
            <h1>FinTrack Internet Banking</h1>
            <div className="sub">Account Mini Statement</div>
            {selectedAccount && (
              <div className="info-grid">
                <div className="info-item"><label>Account Name</label><span>{selectedAccount.accountName}</span></div>
                <div className="info-item"><label>Account Number</label><span>{selectedAccount.accountNumber}</span></div>
                <div className="info-item"><label>Account Type</label><span>{selectedAccount.accountType}</span></div>
                <div className="info-item"><label>Current Balance</label><span>{fmt(selectedAccount.balance)}</span></div>
              </div>
            )}
            <div className="summary">
              <div className="summary-box"><label>Total Credits</label><span style={{ color: '#0a7c4e' }}>{fmt(totalCredit)}</span></div>
              <div className="summary-box"><label>Total Debits</label><span style={{ color: '#c0392b' }}>{fmt(totalDebit)}</span></div>
              <div className="summary-box"><label>Transactions</label><span>{transactions.length}</span></div>
            </div>
          </div>

          {loading ? (
            <div className="loading-page"><span className="spinner dark" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <FileText size={40} />
              <h3>No transactions found</h3>
              <p>No records match the selected filter</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Reference No.</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Fee</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx, i) => (
                    <tr key={tx.id}>
                      <td style={{ color: 'var(--gray-400)', fontSize: 12 }}>{i + 1}</td>
                      <td className="font-mono" style={{ fontSize: 11, color: 'var(--gray-500)' }}>{tx.referenceNumber}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className={`tx-icon ${tx.type?.toLowerCase()}`}>
                            {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={12} /> : tx.type === 'WITHDRAWAL' ? <ArrowUpRight size={12} /> : <ArrowLeftRight size={12} />}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{tx.type}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--gray-600)', fontSize: 12 }}>{tx.description || '—'}</td>
                      <td style={{ fontWeight: 700, color: 'var(--danger)' }}>
                        {tx.type !== 'DEPOSIT' ? fmt(tx.amount) : '—'}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                        {tx.type === 'DEPOSIT' ? fmt(tx.amount) : '—'}
                      </td>
                      <td style={{ color: 'var(--gray-500)', fontSize: 12 }}>{fmt(tx.transactionFee)}</td>
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

        {filtered.length > 0 && (
          <div style={{ padding: '12px 22px', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-100)', fontSize: 11, color: 'var(--gray-500)', borderRadius: '0 0 12px 12px' }}>
            Statement generated on {new Date().toLocaleString('en-IN')} &nbsp;|&nbsp; FinTrack Internet Banking &nbsp;|&nbsp; This is a computer-generated statement and does not require a signature.
          </div>
        )}
      </div>
    </div>
  );
}
