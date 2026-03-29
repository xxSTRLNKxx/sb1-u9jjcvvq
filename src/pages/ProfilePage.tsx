import { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/UI/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const css = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');

.pp-root {
  min-height: 100vh;
  background: #080C14;
  color: #f9fafb;
  font-family: 'Inter', sans-serif;
  padding: 40px 48px;
}
@media (max-width: 768px) { .pp-root { padding: 24px 20px; } }

.pp-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  max-width: 900px;
}
@media (max-width: 900px) { .pp-grid { grid-template-columns: 1fr; } }

.pp-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
}

/* Avatar header */
.pp-card-hero {
  padding: 28px 28px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  gap: 20px;
}
.pp-avatar {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: rgba(29,78,216,0.2);
  border: 2px solid rgba(29,78,216,0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  position: relative;
}
.pp-avatar img { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; }
.pp-avatar-initials {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 600;
  color: #60a5fa;
}
.pp-hero-info {}
.pp-hero-name {
  font-size: 20px;
  font-weight: 700;
  color: #f9fafb;
  letter-spacing: -0.3px;
  margin: 0 0 4px;
}
.pp-hero-email {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}
.pp-role-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.pp-role-admin   { background: rgba(239,68,68,0.1);  color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
.pp-role-manager { background: rgba(245,158,11,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
.pp-role-user    { background: rgba(29,78,216,0.12); color: #60a5fa; border: 1px solid rgba(96,165,250,0.2); }

/* Form body */
.pp-card-body { padding: 28px; }
.pp-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
@media (max-width: 600px) { .pp-form-row { grid-template-columns: 1fr; } }

.pp-field { display: flex; flex-direction: column; }
.pp-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #4b5563;
  margin-bottom: 8px;
}
.pp-input {
  padding: 10px 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #f9fafb;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%; box-sizing: border-box;
}
.pp-input::placeholder { color: #374151; }
.pp-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
}
.pp-input-readonly {
  padding: 10px 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  color: #6b7280;
  font-size: 14px;
  display: flex; align-items: center; gap: 8px;
  cursor: not-allowed;
}
.pp-hint { font-size: 11px; color: #374151; margin-top: 5px; }

/* Toast */
.pp-toast {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 20px;
}
.pp-toast-success {
  background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.2);
  color: #34d399;
}
.pp-toast-error {
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  color: #f87171;
}

/* Footer */
.pp-card-footer {
  padding: 20px 28px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  justify-content: flex-end;
}
.pp-save-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 22px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(29,78,216,0.3);
}
.pp-save-btn:hover:not(:disabled) {
  background: #2563eb;
  box-shadow: 0 4px 20px rgba(37,99,235,0.45);
}
.pp-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Sidebar card */
.pp-side-card { display: flex; flex-direction: column; gap: 20px; }
.pp-info-block {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 22px;
}
.pp-info-block-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #4b5563;
  margin-bottom: 16px;
}
.pp-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.pp-info-row:last-child { border-bottom: none; }
.pp-info-key { font-size: 12px; color: #6b7280; }
.pp-info-val { font-size: 12px; color: #d1d5db; font-family: 'JetBrains Mono', monospace; }
.pp-status-dot {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: #34d399;
  font-family: 'JetBrains Mono', monospace;
}
.pp-status-dot::before {
  content: '';
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #10b981;
}

/* Loading */
.pp-loading {
  display: flex; align-items: center; justify-content: center; height: 300px;
}
.pp-spinner {
  width: 32px; height: 32px;
  border: 2px solid rgba(255,255,255,0.08);
  border-top-color: #1d4ed8;
  border-radius: 50%;
  animation: ppSpin 0.7s linear infinite;
}
@keyframes ppSpin { to { transform: rotate(360deg); } }
`;

function getRoleClass(role: string) {
  if (role === 'admin')   return 'pp-role-badge pp-role-admin';
  if (role === 'manager') return 'pp-role-badge pp-role-manager';
  return 'pp-role-badge pp-role-user';
}

function getInitials(name: string | null, email: string) {
  if (name) {
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }
  return email[0].toUpperCase();
}

export function ProfilePage() {
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    if (profile) setFullName(profile.full_name || '');
  }, [profile]);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);
      if (error) throw error;
      showToast('success', 'Profile updated successfully');
    } catch {
      showToast('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="pp-root">
        <div className="pp-loading"><div className="pp-spinner" /></div>
      </div>
    );
  }

  const initials = getInitials(profile.full_name, profile.email);
  const roleLabel = profile.role === 'admin' ? 'Administrator' : profile.role === 'manager' ? 'Manager' : 'User';

  return (
    <>
      <style>{css}</style>
      <div className="pp-root">
        <PageHeader
          title="My Profile"
          description="Manage your account settings and preferences"
          icon={User}
          subtitle="Account"
        />

        <div className="pp-grid">
          {/* Main card */}
          <div className="pp-card">
            <div className="pp-card-hero">
              <div className="pp-avatar">
                <span className="pp-avatar-initials">{initials}</span>
              </div>
              <div>
                <h2 className="pp-hero-name">{profile.full_name || 'User'}</h2>
                <div className="pp-hero-email">{profile.email}</div>
                <span className={getRoleClass(profile.role)}>{roleLabel}</span>
              </div>
            </div>

            <div className="pp-card-body">
              {toast && (
                <div className={`pp-toast ${toast.type === 'success' ? 'pp-toast-success' : 'pp-toast-error'}`}>
                  {toast.type === 'success'
                    ? <CheckCircle size={15} />
                    : <AlertCircle size={15} />}
                  {toast.msg}
                </div>
              )}

              <div className="pp-form-row">
                <div className="pp-field">
                  <label className="pp-label"><User size={10} style={{ display: 'inline', marginRight: 4 }} />Full Name</label>
                  <input
                    className="pp-input"
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="pp-field">
                  <label className="pp-label"><Mail size={10} style={{ display: 'inline', marginRight: 4 }} />Email Address</label>
                  <div className="pp-input-readonly">
                    <Mail size={14} color="#4b5563" />
                    {profile.email}
                  </div>
                  <span className="pp-hint">Email cannot be changed</span>
                </div>
              </div>

              <div className="pp-form-row">
                <div className="pp-field">
                  <label className="pp-label"><Shield size={10} style={{ display: 'inline', marginRight: 4 }} />Role</label>
                  <div className="pp-input-readonly">
                    <Shield size={14} color="#4b5563" />
                    {roleLabel}
                  </div>
                  <span className="pp-hint">Contact an admin to change your role</span>
                </div>
                <div className="pp-field">
                  <label className="pp-label"><Calendar size={10} style={{ display: 'inline', marginRight: 4 }} />Member Since</label>
                  <div className="pp-input-readonly">
                    <Calendar size={14} color="#4b5563" />
                    {new Date(profile.created_at || Date.now()).toLocaleDateString('en-AU', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="pp-card-footer">
              <button className="pp-save-btn" onClick={handleSave} disabled={saving}>
                <Save size={14} />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="pp-side-card">
            <div className="pp-info-block">
              <div className="pp-info-block-title">Account Details</div>
              <div className="pp-info-row">
                <span className="pp-info-key">Status</span>
                <span className="pp-status-dot">Active</span>
              </div>
              <div className="pp-info-row">
                <span className="pp-info-key">Account ID</span>
                <span className="pp-info-val">{profile.id.slice(0, 8)}…</span>
              </div>
              <div className="pp-info-row">
                <span className="pp-info-key">Role</span>
                <span className="pp-info-val">{profile.role}</span>
              </div>
            </div>

            <div className="pp-info-block">
              <div className="pp-info-block-title">Security</div>
              <div className="pp-info-row">
                <span className="pp-info-key">Password</span>
                <span className="pp-info-val">••••••••</span>
              </div>
              <div className="pp-info-row">
                <span className="pp-info-key">2FA</span>
                <span className="pp-info-val" style={{ color: '#f87171' }}>Disabled</span>
              </div>
              <div className="pp-info-row">
                <span className="pp-info-key">Sessions</span>
                <span className="pp-info-val">1 active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}