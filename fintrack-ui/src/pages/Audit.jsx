import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, RefreshCw } from 'lucide-react';
import { auditApi } from '../api';

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = tab === 'all' ? await auditApi.getLogs() : await auditApi.getFailedActions();
      setLogs(res.data);
    } catch (err) {
      if (err.response?.status === 403) setLogs([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [tab]);

  const fmtDate = (d) => d ? new Date(d).toLocaleString() : '—';

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'failed'].map(t => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(t)}>
            {t === 'all' ? <><ShieldCheck size={15} /> All Logs</> : <><ShieldAlert size={15} /> Failed Actions</>}
          </button>
        ))}
        <button className="btn btn-secondary btn-sm" onClick={load} style={{ marginLeft: 'auto' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{tab === 'all' ? 'All Audit Logs' : 'Failed Actions'}</div>
            <div className="card-subtitle">{logs.length} records</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-page"><span className="spinner dark" /></div>
        ) : logs.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 20px' }}>
            <ShieldCheck size={40} />
            <h3>No logs found</h3>
            <p>{tab === 'failed' ? 'No failed actions recorded' : 'Audit logs will appear here'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>IP Address</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <span className={`badge badge-${log.success ? 'success' : 'danger'}`}>
                        {log.success ? '✓ Success' : '✗ Failed'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{log.username || '—'}</td>
                    <td><span className="badge badge-primary">{log.action}</span></td>
                    <td style={{ color: 'var(--gray-600)' }}>{log.entityType}{log.entityId ? ` #${log.entityId}` : ''}</td>
                    <td className="font-mono" style={{ fontSize: 12, color: 'var(--gray-500)' }}>{log.ipAddress || '—'}</td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 12 }}>{fmtDate(log.timestamp)}</td>
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
