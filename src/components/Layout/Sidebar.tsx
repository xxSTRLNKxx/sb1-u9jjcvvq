import { useState } from 'react';
import {
  LayoutDashboard,
  Server,
  Network,
  Globe,
  MonitorPlay,
  Layers,
  Building2,
  Package,
  ChevronDown,
  ChevronRight,
  LogOut,
  Activity,
  PanelLeftClose,
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onHide?: () => void;
}

interface NavItem {
  id: string;
  label: string;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'dcim',
    label: 'DCIM',
    icon: Server,
    color: '#93AFFF',
    items: [
      { id: 'dcim-sites', label: 'Sites' },
      { id: 'dcim-regions', label: 'Regions' },
      { id: 'dcim-racks', label: 'Racks' },
      { id: 'dcim-manufacturers', label: 'Manufacturers' },
      { id: 'dcim-device-types', label: 'Device Types' },
      { id: 'dcim-device-roles', label: 'Device Roles' },
      { id: 'dcim-platforms', label: 'Platforms' },
      { id: 'dcim-devices', label: 'Devices' },
      { id: 'dcim-interfaces', label: 'Interfaces' },
      { id: 'dcim-cables', label: 'Cables' },
    ],
  },
  {
    id: 'ipam',
    label: 'IPAM',
    icon: Network,
    color: '#34d399',
    items: [
      { id: 'ipam-vrfs', label: 'VRFs' },
      { id: 'ipam-prefixes', label: 'Prefixes' },
      { id: 'ipam-ip-addresses', label: 'IP Addresses' },
      { id: 'ipam-vlans', label: 'VLANs' },
      { id: 'ipam-vlan-groups', label: 'VLAN Groups' },
    ],
  },
  {
    id: 'virtualization',
    label: 'Virtualization',
    icon: MonitorPlay,
    color: '#38bdf8',
    items: [
      { id: 'virt-clusters', label: 'Clusters' },
      { id: 'virt-cluster-types', label: 'Cluster Types' },
      { id: 'virt-virtual-machines', label: 'Virtual Machines' },
    ],
  },
  {
    id: 'circuits',
    label: 'Circuits',
    icon: Layers,
    color: '#fbbf24',
    items: [
      { id: 'circuits-providers', label: 'Providers' },
      { id: 'circuits-types', label: 'Circuit Types' },
      { id: 'circuits-list', label: 'Circuits' },
    ],
  },
  {
    id: 'tenancy',
    label: 'Tenancy',
    icon: Building2,
    color: '#fb923c',
    items: [
      { id: 'tenants', label: 'Tenants' },
      { id: 'tenant-groups', label: 'Tenant Groups' },
      { id: 'contacts', label: 'Contacts' },
      { id: 'contact-groups', label: 'Contact Groups' },
      { id: 'contact-roles', label: 'Contact Roles' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    color: '#f472b6',
    items: [
      { id: 'assets', label: 'Assets' },
      { id: 'locations', label: 'Locations' },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: Globe,
    color: '#22d3ee',
    items: [
      { id: 'diagrams', label: 'Diagrams' },
      { id: 'designer', label: 'Designer' },
    ],
  },
  {
    id: 'admin',
    label: 'Administration',
    icon: Shield,
    color: '#f87171',
    items: [
      { id: 'users', label: 'Users' },
      { id: 'activity-log', label: 'Activity Log' },
    ],
  },
];

function sectionOwns(section: NavSection, view: string) {
  return section.items.some((i) => i.id === view);
}

function getInitials(name: string | null | undefined, email: string | null | undefined) {
  if (name) return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  return (email?.[0] ?? 'U').toUpperCase();
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');

.sb-root {
  width: 232px;
  background: #0B0F1A;
  border-right: 1px solid rgba(255,255,255,0.06);
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  position: relative;
}

/* Subtle glow at top */
.sb-root::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 160px;
  background: radial-gradient(ellipse at top, rgba(79,110,247,0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* Brand header */
.sb-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.sb-brand-icon {
  width: 34px; height: 34px;
  background: #4F6EF7;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(79,110,247,0.45);
}
.sb-brand-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  color: #EEF2FF;
  letter-spacing: -0.5px;
  flex: 1;
  line-height: 1;
}
.sb-brand-tagline {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 500;
  color: #4F6EF7;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-top: 3px;
  opacity: 0.8;
}
.sb-hide-btn {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.sb-hide-btn:hover { background: rgba(255,255,255,0.06); color: #9ca3af; }

/* Dashboard button */
.sb-dashboard {
  padding: 10px 10px 6px;
  flex-shrink: 0;
  position: relative; z-index: 1;
}
.sb-dash-btn {
  width: 100%;
  display: flex; align-items: center; gap: 9px;
  padding: 9px 12px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-align: left;
}
.sb-dash-btn-active {
  background: rgba(79,110,247,0.2);
  color: #BAD0FF;
  border: 1px solid rgba(79,110,247,0.3);
}
.sb-dash-btn-active .sb-dash-icon { color: #93AFFF; }
.sb-dash-btn-inactive {
  background: transparent;
  color: #6b7280;
  border: 1px solid transparent;
}
.sb-dash-btn-inactive:hover {
  background: rgba(255,255,255,0.04);
  color: #d1d5db;
}
.sb-dash-icon { flex-shrink: 0; }

/* Nav scroll area */
.sb-nav {
  flex: 1;
  overflow-y: auto;
  padding: 4px 10px 8px;
  position: relative; z-index: 1;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.06) transparent;
}
.sb-nav::-webkit-scrollbar { width: 3px; }
.sb-nav::-webkit-scrollbar-track { background: transparent; }
.sb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }

/* Section label */
.sb-section { margin-bottom: 2px; }
.sb-section-btn {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between;
  padding: 7px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background 0.12s;
  gap: 8px;
}
.sb-section-btn:hover { background: rgba(255,255,255,0.04); }
.sb-section-btn-active { background: rgba(255,255,255,0.04); }
.sb-section-left { display: flex; align-items: center; gap: 8px; }
.sb-section-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  color: #4b5563;
  font-family: 'Inter', sans-serif;
  transition: color 0.12s;
}
.sb-section-btn-active .sb-section-label,
.sb-section-btn:hover .sb-section-label { color: #9ca3af; }
.sb-chevron { color: #2d3748; flex-shrink: 0; transition: color 0.12s; }
.sb-section-btn:hover .sb-chevron { color: #4b5563; }

/* Section items */
.sb-items {
  margin: 2px 0 4px 16px;
  padding-left: 10px;
  border-left: 1px solid rgba(255,255,255,0.05);
}
.sb-item-btn {
  width: 100%;
  display: flex; align-items: center;
  padding: 6px 10px;
  border: none;
  border-radius: 7px;
  background: transparent;
  font-size: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s, color 0.12s;
  margin-bottom: 1px;
}
.sb-item-active {
  background: rgba(79,110,247,0.18);
  color: #BAD0FF;
}
.sb-item-active::before {
  content: '';
  display: inline-block;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #6B8EFF;
  margin-right: 8px;
  flex-shrink: 0;
}
.sb-item-inactive {
  color: #4b5563;
}
.sb-item-inactive:hover {
  background: rgba(255,255,255,0.04);
  color: #9ca3af;
}

/* Divider */
.sb-divider {
  height: 1px;
  background: rgba(255,255,255,0.05);
  margin: 0 10px;
  flex-shrink: 0;
}

/* Footer */
.sb-footer {
  padding: 10px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative; z-index: 1;
}

/* User card */
.sb-user-card {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 8px;
  cursor: default;
}
.sb-user-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: rgba(79,110,247,0.2);
  border: 1px solid rgba(79,110,247,0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  color: #93AFFF;
}
.sb-user-info { flex: 1; min-width: 0; }
.sb-user-name {
  font-size: 12px;
  font-weight: 600;
  color: #d1d5db;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sb-user-role {
  font-size: 10px;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-top: 1px;
}

/* Footer buttons */
.sb-footer-btn {
  width: 100%;
  display: flex; align-items: center; gap: 9px;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s, color 0.12s;
}
.sb-footer-btn-active {
  background: rgba(79,110,247,0.18);
  color: #BAD0FF;
}
.sb-footer-btn-inactive {
  color: #4b5563;
}
.sb-footer-btn-inactive:hover {
  background: rgba(255,255,255,0.04);
  color: #9ca3af;
}
.sb-footer-btn-signout {
  color: #374151;
}
.sb-footer-btn-signout:hover {
  background: rgba(239,68,68,0.08);
  color: #f87171;
}
`;

export function Sidebar({ currentView, onViewChange, onHide }: SidebarProps) {
  const { signOut, user, profile } = useAuth();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NAV_SECTIONS.forEach((s) => { init[s.id] = sectionOwns(s, currentView); });
    return init;
  });

  const toggle = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const initials = getInitials(profile?.full_name, user?.email);
  const roleLabel = profile?.role ?? 'user';

  return (
    <>
      <style>{css}</style>
      <div className="sb-root">
        {/* Brand */}
        <div className="sb-brand">
          <div className="sb-brand-icon">
            <Activity size={16} color="#fff" />
          </div>
          <div>
            <div className="sb-brand-name">Aetheria</div>
            <div className="sb-brand-tagline">IT Operations</div>
          </div>
          {onHide && (
            <button className="sb-hide-btn" onClick={onHide} title="Collapse sidebar">
              <PanelLeftClose size={14} />
            </button>
          )}
        </div>

        {/* Dashboard */}
        <div className="sb-dashboard">
          <button
            className={`sb-dash-btn ${currentView === 'dashboard' ? 'sb-dash-btn-active' : 'sb-dash-btn-inactive'}`}
            onClick={() => onViewChange('dashboard')}
          >
            <LayoutDashboard size={14} className="sb-dash-icon" />
            Dashboard
          </button>
        </div>

        {/* Nav */}
        <nav className="sb-nav">
          {NAV_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isOpen = !!expanded[section.id];
            const isActive = sectionOwns(section, currentView);

            return (
              <div key={section.id} className="sb-section">
                <button
                  className={`sb-section-btn ${isActive ? 'sb-section-btn-active' : ''}`}
                  onClick={() => toggle(section.id)}
                >
                  <div className="sb-section-left">
                    <Icon size={13} color={isActive || isOpen ? section.color : '#2d3748'} />
                    <span className="sb-section-label">{section.label}</span>
                  </div>
                  {isOpen
                    ? <ChevronDown size={11} className="sb-chevron" />
                    : <ChevronRight size={11} className="sb-chevron" />
                  }
                </button>

                {isOpen && (
                  <div className="sb-items">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        className={`sb-item-btn ${currentView === item.id ? 'sb-item-active' : 'sb-item-inactive'}`}
                        onClick={() => onViewChange(item.id)}
                      >
                        {currentView !== item.id && (
                          <span style={{ display: 'inline-block', width: 4, height: 4, marginRight: 8, flexShrink: 0 }} />
                        )}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sb-divider" />

        {/* Footer */}
        <div className="sb-footer">
          {/* User card */}
          <div className="sb-user-card">
            <div className="sb-user-avatar">{initials}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{profile?.full_name || user?.email || 'User'}</div>
              <div className="sb-user-role">{roleLabel}</div>
            </div>
          </div>

          {/* Admin links */}
          {profile?.role === 'admin' && (
            <>
              <button
                className={`sb-footer-btn ${currentView === 'users' ? 'sb-footer-btn-active' : 'sb-footer-btn-inactive'}`}
                onClick={() => onViewChange('users')}
              >
                <Shield size={13} />
                Users
              </button>
              <button
                className={`sb-footer-btn ${currentView === 'activity-log' ? 'sb-footer-btn-active' : 'sb-footer-btn-inactive'}`}
                onClick={() => onViewChange('activity-log')}
              >
                <Activity size={13} />
                Activity Log
              </button>
            </>
          )}

          <button
            className={`sb-footer-btn ${currentView === 'profile' ? 'sb-footer-btn-active' : 'sb-footer-btn-inactive'}`}
            onClick={() => onViewChange('profile')}
          >
            <User size={13} />
            My Profile
          </button>

          <button className="sb-footer-btn sb-footer-btn-signout" onClick={signOut}>
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}