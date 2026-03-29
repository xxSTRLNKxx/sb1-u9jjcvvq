import { useState, useEffect } from 'react';
import { Users, Shield, Pencil, Trash2, X, Save } from 'lucide-react';
import api from '../../lib/api';
import { PageHeader } from '../../components/UI/PageHeader';
import { StatusBadge } from '../../components/UI/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';

const css = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');

.up-root {
  min-height: 100vh;
  background: #0D1220;
  color: #EEF2FF;
  font-family: 'Inter', sans-serif;
  padding: 40px 48px;
}
@media (max-width: 768px) { .up-root { padding: 24px 20px; } }

/* Permission denied */
.up-denied {
  display: flex; align-items: center; gap: 12px;
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 12px;
  padding: 18px 22px;
  color: #fbbf24;
  font-size: 14px;
}

/* Table card */
.up-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
}

.up-table { width: 100%; border-collapse: collapse; }
.up-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.07); }
.up-table th {
  padding: 14px 20px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #4b5563;
}
.up-table th:last-child { text-align: right; }
.up-table td {
  padding: 16px 20px;
  font-size: 13px;
  color: #e5e7eb;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.up-table tbody tr:last-child td { border-bottom: none; }
.up-table tbody tr:hover { background: rgba(255,255,255,0.03); }

/* User cell */
.up-user-cell { display: flex; align-items: center; gap: 12px; }
.up-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(79,110,247,0.2);
  border: 1px solid rgba(79,110,247,0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  color: #93AFFF;
  overflow: hidden;
}
.up-avatar img { width: 100%; height: 100%; object-fit: cover; }
.up-user-name { font-weight: 600; color: #EEF2FF; font-size: 13px; }
.up-user-email { font-size: 12px; color: #6b7280; margin-top: 1px; }

/* Actions */
.up-actions { display: flex; align-items: center; justify-content: flex-end; gap: 6px; }
.up-icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  background: transparent;
}
.up-icon-btn-edit  { color: #93AFFF; }
.up-icon-btn-edit:hover  { background: rgba(79,110,247,0.15); }
.up-icon-btn-del   { color: #f87171; }
.up-icon-btn-del:hover   { background: rgba(239,68,68,0.12); }

/* Loading */
.up-loading { display: flex; align-items: center; justify-content: center; height: 280px; }
.up-spinner {
  width: 32px; height: 32px;
  border: 2px solid rgba(255,255,255,0.08);
  border-top-color: #4F6EF7;
  border-radius: 50%;
  animation: upSpin 0.7s linear infinite;
}
@keyframes upSpin { to { transform: rotate(360deg); } }

/* Empty state */
.up-empty {
  text-align: center;
  padding: 64px 20px;
  color: #4b5563;
}
.up-empty svg { margin: 0 auto 12px; opacity: 0.3; }
.up-empty p { font-size: 14px; }

/* Modal overlay */
.up-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  padding: 20px;
}
.up-modal {
  background: #111D2E;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 18px;
  width: 100%; max-width: 440px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}
.up-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.up-modal-title {
  font-size: 16px; font-weight: 700; color: #EEF2FF;
  letter-spacing: -0.3px;
}
.up-modal-close {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: rgba(255,255,255,0.05);
  color: #6b7280;
  transition: background 0.15s, color 0.15s;
}
.up-modal-close:hover { background: rgba(255,255,255,0.1); color: #EEF2FF; }

.up-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.up-field {}
.up-field-label {
  display: block;
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.7px;
  color: #4b5563; margin-bottom: 8px;
}
.up-field-input, .up-field-select {
  width: 100%; box-sizing: border-box;
  padding: 10px 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #EEF2FF;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.up-field-input::placeholder { color: #374151; }
.up-field-input:focus, .up-field-select:focus {
  border-color: #6175F8;
  box-shadow: 0 0 0 3px rgba(97,117,248,0.15);
}
.up-field-select option { background: #131C2E; }

.up-modal-footer {
  display: flex; justify-content: flex-end; gap: 8px;
  padding: 18px 24px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.up-btn-cancel {
  padding: 9px 18px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: #9ca3af;
  font-size: 13px; font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}
.up-btn-cancel:hover { background: rgba(255,255,255,0.09); color: #EEF2FF; }
.up-btn-save {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 20px;
  background: #4F6EF7;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 13px; font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 4px 14px rgba(79,110,247,0.3);
}
.up-btn-save:hover { background: #6175F8; }
`;

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'user' | 'read_only';
  is_active: boolean;
  created_at: string;
  email?: string;
}

function getInitials(name: string, email?: string) {
  if (name) return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  return (email?.[0] ?? 'U').toUpperCase();
}

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await api.users.getAll();
      setUsers(data || []);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.users.delete(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    const fd = new FormData(e.currentTarget);
    try {
      await api.users.update(editingUser.id, {
        full_name: fd.get('full_name') as string,
        role: fd.get('role') as string,
        is_active: fd.get('is_active') === 'true',
      });
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="up-root">
        <div className="up-denied">
          <Shield size={18} />
          You do not have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="up-root">
        <PageHeader
          title="User Management"
          description="Manage who has access to Aetheria and their roles"
          icon={Shield}
          subtitle="Admin"
          count={users.length}
        />

        {loading ? (
          <div className="up-loading"><div className="up-spinner" /></div>
        ) : (
          <div className="up-card">
            <table className="up-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="up-empty">
                        <Users size={32} />
                        <p>No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="up-user-cell">
                        <div className="up-avatar">
                          {u.avatar_url
                            ? <img src={u.avatar_url} alt={u.full_name} />
                            : getInitials(u.full_name, u.email)
                          }
                        </div>
                        <div>
                          <div className="up-user-name">{u.full_name || '—'}</div>
                          <div className="up-user-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusBadge
                        status={u.role}
                        label={u.role.replace('_', ' ')}
                        color={u.role === 'admin' ? 'red' : u.role === 'read_only' ? 'gray' : 'blue'}
                      />
                    </td>
                    <td>
                      <StatusBadge
                        status={u.is_active ? 'active' : 'inactive'}
                        label={u.is_active ? 'Active' : 'Inactive'}
                        color={u.is_active ? 'green' : 'gray'}
                      />
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6b7280' }}>
                      {new Date(u.created_at).toLocaleDateString('en-AU')}
                    </td>
                    <td>
                      <div className="up-actions">
                        <button className="up-icon-btn up-icon-btn-edit" onClick={() => setEditingUser(u)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="up-icon-btn up-icon-btn-del" onClick={() => handleDelete(u.id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit modal */}
        {editingUser && (
          <div className="up-overlay" onClick={() => setEditingUser(null)}>
            <div className="up-modal" onClick={e => e.stopPropagation()}>
              <div className="up-modal-header">
                <span className="up-modal-title">Edit User</span>
                <button className="up-modal-close" onClick={() => setEditingUser(null)}>
                  <X size={15} />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="up-modal-body">
                  <div className="up-field">
                    <label className="up-field-label">Full Name</label>
                    <input
                      className="up-field-input"
                      name="full_name"
                      type="text"
                      defaultValue={editingUser.full_name}
                      required
                      placeholder="Full name"
                    />
                  </div>
                  <div className="up-field">
                    <label className="up-field-label">Role</label>
                    <select className="up-field-select" name="role" defaultValue={editingUser.role}>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="read_only">Read Only</option>
                    </select>
                  </div>
                  <div className="up-field">
                    <label className="up-field-label">Status</label>
                    <select className="up-field-select" name="is_active" defaultValue={editingUser.is_active ? 'true' : 'false'}>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="up-modal-footer">
                  <button type="button" className="up-btn-cancel" onClick={() => setEditingUser(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="up-btn-save">
                    <Save size={13} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}