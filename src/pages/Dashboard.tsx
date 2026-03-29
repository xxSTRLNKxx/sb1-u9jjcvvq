import { useEffect, useState } from 'react';
import { MapPin, Server, Network, Cable, Database, Users, TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  sites: number;
  assets: number;
  devices: number;
  diagrams: number;
  locations: number;
  manufacturers: number;
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');

.db-root {
  min-height: 100vh;
  background: #0D1220;
  color: #EEF2FF;
  font-family: 'Inter', sans-serif;
  padding: 40px 48px;
  position: relative;
}
@media (max-width: 768px) { .db-root { padding: 24px 20px; } }

.db-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(79,110,247,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79,110,247,0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 100% 60% at 50% 0%, black 20%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}

.db-glow {
  position: fixed;
  width: 600px; height: 400px;
  background: radial-gradient(ellipse, rgba(79,110,247,0.12) 0%, transparent 70%);
  top: -100px; right: -100px;
  pointer-events: none;
  z-index: 0;
}

.db-content { position: relative; z-index: 1; }

/* Header */
.db-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 40px;
  gap: 16px;
  flex-wrap: wrap;
}
.db-header-left {}
.db-greeting {
  font-size: 13px;
  color: #4b5563;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 6px;
}
.db-title {
  font-size: 28px;
  font-weight: 700;
  color: #EEF2FF;
  letter-spacing: -0.8px;
  margin: 0;
}
.db-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 6px 0 0;
}
.db-live-tag {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 12px;
  color: #34d399;
  font-family: 'JetBrains Mono', monospace;
}
.db-live-dot {
  width: 7px; height: 7px;
  background: #10b981;
  border-radius: 50%;
  animation: livePulse 2s ease-in-out infinite;
}
@keyframes livePulse {
  0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
  50%      { opacity: 0.7; box-shadow: 0 0 0 4px rgba(16,185,129,0); }
}

/* Divider */
.db-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin-bottom: 32px;
}

/* Stat grid */
.db-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}
.db-stat-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.2s, background 0.2s;
  cursor: default;
}
.db-stat-card:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.12);
}
.db-stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.db-stat-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.db-stat-trend {
  display: flex; align-items: center; gap: 3px;
  font-size: 11px;
  color: #34d399;
}
.db-stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 600;
  color: #EEF2FF;
  line-height: 1;
}
.db-stat-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #4b5563;
  margin-top: 4px;
}

/* Bottom row */
.db-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 900px) { .db-bottom { grid-template-columns: 1fr; } }

/* Quick actions */
.db-section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #4b5563;
  margin-bottom: 14px;
}
.db-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 22px;
}
.db-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.db-action-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: #EEF2FF;
  text-align: left;
  width: 100%;
  font-family: 'Inter', sans-serif;
}
.db-action-btn:hover {
  background: rgba(79,110,247,0.1);
  border-color: rgba(79,110,247,0.3);
}
.db-action-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.db-action-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.05);
  flex-shrink: 0;
}
.db-action-title {
  font-size: 13px;
  font-weight: 600;
  color: #e5e7eb;
}
.db-action-desc {
  font-size: 11px;
  color: #4b5563;
  margin-top: 1px;
}

/* System status */
.db-status-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.db-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 10px;
}
.db-status-name {
  font-size: 13px;
  color: #d1d5db;
  font-weight: 500;
}
.db-status-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
}
.db-status-ok   { color: #34d399; }
.db-status-warn { color: #fbbf24; }

/* Loading */
.db-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}
.db-spinner {
  width: 32px; height: 32px;
  border: 2px solid rgba(255,255,255,0.08);
  border-top-color: #4F6EF7;
  border-radius: 50%;
  animation: dbSpin 0.7s linear infinite;
}
@keyframes dbSpin { to { transform: rotate(360deg); } }
`;

const STAT_CONFIG = [
  { key: 'sites',         label: 'Sites',         icon: MapPin,   color: '#6B8EFF', bg: 'rgba(59,130,246,0.12)' },
  { key: 'assets',        label: 'Assets',         icon: Server,   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { key: 'devices',       label: 'Devices',        icon: Network,  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { key: 'diagrams',      label: 'Diagrams',       icon: Cable,    color: '#06b6d4', bg: 'rgba(6,182,212,0.12)'  },
  { key: 'locations',     label: 'Locations',      icon: Database, color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  { key: 'manufacturers', label: 'Manufacturers',  icon: Users,    color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
] as const;

const QUICK_ACTIONS = [
  { icon: Server,  title: 'Add Asset',               desc: 'Register an asset in Asset Aether',    view: 'assets'         },
  { icon: MapPin,  title: 'Add Site',                 desc: 'Add a site to Infrastructure Aether',   view: 'locations'       },
  { icon: Network, title: 'Design Infrastructure',    desc: 'Launch the Network Aether designer', view: 'designer'        },
];

const SYSTEM_STATUS = [
  { name: 'Database',      status: 'Operational', ok: true  },
  { name: 'Auth Service',  status: 'Operational', ok: true  },
  { name: 'API Gateway',   status: 'Operational', ok: true  },
  { name: 'Storage',       status: 'Operational', ok: true  },
];

interface DashboardProps {
  onViewChange?: (view: string) => void;
}

export function Dashboard({ onViewChange }: DashboardProps) {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({ sites: 0, assets: 0, devices: 0, diagrams: 0, locations: 0, manufacturers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const [
        { count: sitesCount },
        { count: assetsCount },
        { count: devicesCount },
        { count: diagramsCount },
        { count: locationsCount },
        { count: manufacturersCount },
      ] = await Promise.all([
        supabase.from('sites').select('*', { count: 'exact', head: true }),
        supabase.from('assets').select('*', { count: 'exact', head: true }),
        supabase.from('devices').select('*', { count: 'exact', head: true }),
        supabase.from('infrastructure_diagrams').select('*', { count: 'exact', head: true }),
        supabase.from('locations').select('*', { count: 'exact', head: true }),
        supabase.from('manufacturers').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        sites: sitesCount || 0,
        assets: assetsCount || 0,
        devices: devicesCount || 0,
        diagrams: diagramsCount || 0,
        locations: locationsCount || 0,
        manufacturers: manufacturersCount || 0,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const name = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <>
      <style>{css}</style>
      <div className="db-root">
        <div className="db-glow" />
        <div className="db-content">

          {/* Header */}
          <div className="db-header">
            <div className="db-header-left">
              <div className="db-greeting">// {greeting}, {name} — welcome to Aetheria</div>
              <h1 className="db-title">Infrastructure Overview</h1>
              <p className="db-subtitle">
                {now.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="db-live-tag">
              <span className="db-live-dot" />
              All systems nominal
            </div>
          </div>

          <div className="db-divider" />

          {loading ? (
            <div className="db-loading">
              <div className="db-spinner" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="db-stats">
                {STAT_CONFIG.map(({ key, label, icon: Icon, color, bg }) => (
                  <div key={key} className="db-stat-card">
                    <div className="db-stat-top">
                      <div className="db-stat-icon" style={{ background: bg }}>
                        <Icon size={17} color={color} />
                      </div>
                      <div className="db-stat-trend">
                        <TrendingUp size={11} />
                        live
                      </div>
                    </div>
                    <div>
                      <div className="db-stat-value">{stats[key as keyof Stats]}</div>
                      <div className="db-stat-label">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom row */}
              <div className="db-bottom">
                {/* Quick actions */}
                <div className="db-card">
                  <div className="db-section-title">Quick Actions</div>
                  <div className="db-actions">
                    {QUICK_ACTIONS.map(({ icon: Icon, title, desc, view }) => (
                      <button
                        key={view}
                        className="db-action-btn"
                        onClick={() => onViewChange?.(view)}
                      >
                        <div className="db-action-left">
                          <div className="db-action-icon">
                            <Icon size={16} color="#93AFFF" />
                          </div>
                          <div>
                            <div className="db-action-title">{title}</div>
                            <div className="db-action-desc">{desc}</div>
                          </div>
                        </div>
                        <ArrowRight size={14} color="#374151" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* System status */}
                <div className="db-card">
                  <div className="db-section-title">System Status</div>
                  <div className="db-status-list">
                    {SYSTEM_STATUS.map(({ name, status, ok }) => (
                      <div key={name} className="db-status-row">
                        <span className="db-status-name">{name}</span>
                        <span className={`db-status-badge ${ok ? 'db-status-ok' : 'db-status-warn'}`}>
                          <Activity size={11} />
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}