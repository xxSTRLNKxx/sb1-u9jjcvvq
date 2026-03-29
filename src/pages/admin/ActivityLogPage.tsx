import { useState, useEffect } from 'react';
import { Activity, Filter, Shield, ChevronDown } from 'lucide-react';
import api from '../../lib/api';
import { PageHeader } from '../../components/UI/PageHeader';
import { StatusBadge } from '../../components/UI/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';

const css = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');

.al-root {
  min-height: 100vh;
  background: #0D1220;
  color: #EEF2FF;
  font-family: 'Inter', sans-serif;
  padding: 40px 48px;
}
@media (max-width: 768px) { .al-root { padding: 24px 20px; } }

/* Denied */
.al-denied {
  display: flex; align-items: center; gap: 12px;
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 12px;
  padding: 18px 22px;
  color: #fbbf24;
  font-size: 14px;
}

/* Filter bar */
.al-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.al-filter-label {
  display: flex; align-items: center; gap: 7px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #4b5563;
}
.al-select-wrap {
  position: relative;
  display: flex; align-items: center;
}
.al-select {
  appearance: none;
  padding: 8px 32px 8px 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #d1d5db;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  min-width: 150px;
}
.al-select:focus { border-color: #6175F8; }
.al-select option { background: #131C2E; }
.al-select-icon {
  position: absolute; right: 10px;
  pointer-events: none; color: #4b5563;
}
.al-filter-sep { width: 1px; height: 24px; background: rgba(255,255,255,0.07); margin: 0 4px; }

/* Count tag */
.al-count-tag {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #4b5563;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 3px 12px;
}

/* Table card */
.al-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
}
.al-table { width: 100%; border-collapse: collapse; }
.al-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.07); }
.al-table th {
  padding: 14px 20px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #4b5563;
}
.al-table td {
  padding: 14px 20px;
  font-size: 13px;
  color: #e5e7eb;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.al-table tbody tr:last-child td { border-bottom: none; }
.al-table tbody tr:hover { background: rgba(255,255,255,0.025); }

.al-ts {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}
.al-record {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #4b5563;
}
.al-table-name {
  font-size: 13px;
  color: #9ca3af;
}

/* Loading */
.al-loading { display: flex; align-items: center; justify-content: center; height: 280px; }
.al-spinner {
  width: 32px; height: 32px;
  border: 2px solid rgba(255,255,255,0.08);
  border-top-color: #4F6EF7;
  border-radius: 50%;
  animation: alSpin 0.7s linear infinite;
}
@keyframes alSpin { to { transform: rotate(360deg); } }

/* Empty */
.al-empty {
  text-align: center;
  padding: 64px 20px;
  color: #374151;
}
.al-empty p { font-size: 14px; margin-top: 10px; }
`;

interface ActivityLogEntry {
  id: string;
  user_id: string;
  action: 'created' | 'updated' | 'deleted';
  table_name: string;
  record_id: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  created_at: string;
  user_name?: string;
}

function formatTableName(t: string) {
  return t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getActionColor(action: string) {
  if (action === 'created') return 'green';
  if (action === 'updated') return 'blue';
  if (action === 'deleted') return 'red';
  return 'gray';
}

export function ActivityLogPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('all');
  const [filterTable, setFilterTable] = useState('all');

  useEffect(() => { loadActivities(); }, [filterAction, filterTable]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await api.activityLog.getAll({ action: filterAction, table_name: filterTable });
      setActivities(data || []);
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="al-root">
        <div className="al-denied">
          <Shield size={18} />
          You do not have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="al-root">
        <PageHeader
          title="Activity Log"
          description="Complete audit trail across all Aethers"
          icon={Activity}
          subtitle="Admin"
        />

        {/* Filters */}
        <div className="al-filters">
          <span className="al-filter-label">
            <Filter size={12} />
            Filter
          </span>

          <div className="al-select-wrap">
            <select className="al-select" value={filterAction} onChange={e => setFilterAction(e.target.value)}>
              <option value="all">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </select>
            <ChevronDown size={13} className="al-select-icon" />
          </div>

          <div className="al-filter-sep" />

          <div className="al-select-wrap">
            <select className="al-select" value={filterTable} onChange={e => setFilterTable(e.target.value)}>
              <option value="all">All Tables</option>
              <option value="dcim_devices">Devices</option>
              <option value="dcim_sites">Sites</option>
              <option value="ipam_ip_addresses">IP Addresses</option>
              <option value="user_profiles">User Profiles</option>
            </select>
            <ChevronDown size={13} className="al-select-icon" />
          </div>

          {!loading && (
            <span className="al-count-tag">{activities.length} records</span>
          )}
        </div>

        {loading ? (
          <div className="al-loading"><div className="al-spinner" /></div>
        ) : (
          <div className="al-card">
            <table className="al-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Table</th>
                  <th>Record ID</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="al-empty">
                        <Activity size={28} style={{ margin: '0 auto', opacity: 0.25 }} />
                        <p>No activity records found</p>
                      </div>
                    </td>
                  </tr>
                ) : activities.map(a => (
                  <tr key={a.id}>
                    <td>
                      <span className="al-ts">
                        {new Date(a.created_at).toLocaleDateString('en-AU', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                        {' '}
                        {new Date(a.created_at).toLocaleTimeString('en-AU', {
                          hour: '2-digit', minute: '2-digit', second: '2-digit',
                        })}
                      </span>
                    </td>
                    <td style={{ color: '#d1d5db' }}>{a.user_name || '—'}</td>
                    <td>
                      <StatusBadge
                        status={a.action}
                        label={a.action}
                        color={getActionColor(a.action)}
                      />
                    </td>
                    <td><span className="al-table-name">{formatTableName(a.table_name)}</span></td>
                    <td>
                      <span className="al-record">
                        {a.record_id ? a.record_id.slice(0, 8) + '…' : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}