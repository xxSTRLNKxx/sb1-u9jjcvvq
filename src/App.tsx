import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Sidebar } from './components/Layout/Sidebar';
import { ProfilePage } from './pages/ProfilePage';
import { UsersPage } from './pages/admin/UsersPage';
import { ActivityLogPage } from './pages/admin/ActivityLogPage';
import { LocationsPage } from './pages/LocationsPage';
import { AssetsPage } from './pages/AssetsPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { DesignerPage } from './pages/DesignerPage';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D1220',
      color: '#EEF2FF',
      fontFamily: 'Inter, sans-serif',
      padding: '40px 48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#374151' }}>// aether coming soon</p>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>{title}</h1>
      <p style={{ fontSize: 14, color: '#4b5563', margin: 0 }}>This feature is under development</p>
    </div>
  );
}

const VIEW_MAP: Record<string, React.ComponentType> = {
  profile: ProfilePage,
  users: UsersPage,
  'activity-log': ActivityLogPage,
  locations: LocationsPage,
  assets: AssetsPage,
  infrastructure: InfrastructurePage,
  designer: DesignerPage,
};

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0D1220',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '2px solid rgba(255,255,255,0.08)',
          borderTopColor: '#4F6EF7',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  const ViewComponent = VIEW_MAP[currentView];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0D1220', overflow: 'hidden' }}>
      {sidebarVisible && (
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          onHide={() => setSidebarVisible(false)}
        />
      )}

      {!sidebarVisible && (
        <button
          onClick={() => setSidebarVisible(true)}
          style={{
            position: 'fixed',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 48,
            borderRadius: '0 8px 8px 0',
            background: '#1E3A5F',
            color: '#93AFFF',
            border: '1px solid rgba(97,117,248,0.25)',
            borderLeft: 'none',
            cursor: 'pointer',
            transition: 'width 0.15s',
          }}
          title="Show sidebar"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {currentView === 'dashboard' ? (
          <Dashboard onViewChange={setCurrentView} />
        ) : ViewComponent ? (
          <ViewComponent />
        ) : (
          <PlaceholderPage title={currentView} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}