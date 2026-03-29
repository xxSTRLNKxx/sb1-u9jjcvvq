import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, User, Activity, ArrowRight, AlertCircle } from 'lucide-react';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password, fullName);
      if (authError) setError(authError.message);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setError('');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');

        .auth-root {
          min-height: 100vh;
          background-color: #0D1220;
          display: flex;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Animated grid background */
        .auth-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(79, 110, 247, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79, 110, 247, 0.07) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%);
          pointer-events: none;
        }

        /* Glow orbs */
        .glow-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.25;
          animation: orbDrift 12s ease-in-out infinite alternate;
        }
        .glow-orb-1 {
          width: 500px; height: 500px;
          background: #4F6EF7;
          top: -150px; left: -150px;
          animation-delay: 0s;
        }
        .glow-orb-2 {
          width: 350px; height: 350px;
          background: #6D28D9;
          bottom: -100px; right: -80px;
          animation-delay: -5s;
          opacity: 0.18;
        }
        @keyframes orbDrift {
          from { transform: translate(0, 0); }
          to { transform: translate(30px, 20px); }
        }

        /* Left panel */
        .auth-left {
          display: none;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 64px;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 1024px) {
          .auth-left { display: flex; }
        }

        .brand-mark {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-icon {
          width: 38px; height: 38px;
          background: #4F6EF7;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 24px rgba(79, 110, 247, 0.5);
        }
        .brand-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .left-headline {
          max-width: 420px;
        }
        .left-headline h2 {
          font-size: 44px;
          font-weight: 300;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -1.5px;
          margin: 0 0 20px;
        }
        .left-headline h2 strong {
          font-weight: 600;
          color: #93AFFF;
        }
        .left-headline p {
          font-size: 15px;
          color: #6b7280;
          line-height: 1.7;
          margin: 0;
        }

        .stat-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 20px 16px;
        }
        .stat-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 28px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #4b5563;
          font-weight: 500;
        }

        /* Right panel / form */
        .auth-right {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 1024px) {
          .auth-right {
            width: 480px;
            flex-shrink: 0;
            border-left: 1px solid rgba(255,255,255,0.05);
            background: rgba(255,255,255,0.015);
            backdrop-filter: blur(12px);
            padding: 48px 56px;
          }
        }

        .form-card {
          width: 100%;
          max-width: 400px;
        }

        /* Mobile brand */
        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
        }
        @media (min-width: 1024px) {
          .mobile-brand { display: none; }
        }

        .form-heading {
          margin-bottom: 32px;
        }
        .form-heading h1 {
          font-size: 26px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.5px;
          margin: 0 0 6px;
        }
        .form-heading p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        /* Tab switcher */
        .tab-switch {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 28px;
        }
        .tab-btn {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: #6b7280;
        }
        .tab-btn.active {
          background: #4F6EF7;
          color: #fff;
          box-shadow: 0 2px 8px rgba(79, 110, 247, 0.35);
        }
        .tab-btn:not(.active):hover {
          color: #d1d5db;
        }

        /* Error */
        .error-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 20px;
          color: #f87171;
          font-size: 13px;
          line-height: 1.5;
        }
        .error-box svg { margin-top: 1px; flex-shrink: 0; }

        /* Field */
        .field {
          margin-bottom: 16px;
        }
        .field label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 8px;
        }
        .field-input {
          position: relative;
        }
        .field-input input {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #EEF2FF;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input input::placeholder { color: #374151; }
        .field-input input:focus {
          border-color: #6175F8;
          box-shadow: 0 0 0 3px rgba(97, 117, 248, 0.15);
        }

        /* Submit */
        .submit-btn {
          width: 100%;
          margin-top: 8px;
          padding: 12px;
          background: #4F6EF7;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(79, 110, 247, 0.3);
        }
        .submit-btn:hover:not(:disabled) {
          background: #6175F8;
          box-shadow: 0 4px 24px rgba(97, 117, 248, 0.45);
        }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .form-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: #4b5563;
          line-height: 1.6;
        }
        .form-footer a {
          color: #6B8EFF;
          cursor: pointer;
          text-decoration: none;
        }
        .form-footer a:hover { text-decoration: underline; }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .divider-text {
          font-size: 11px;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Tag */
        .version-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(79, 110, 247, 0.12);
          border: 1px solid rgba(79, 110, 247, 0.25);
          border-radius: 20px;
          padding: 4px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #93AFFF;
          margin-bottom: 28px;
        }
        .version-dot {
          width: 6px; height: 6px;
          background: #6B8EFF;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div className="auth-root">
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />

        {/* Left panel */}
        <div className="auth-left">
          <div className="brand-mark">
            <div className="brand-icon">
              <Activity size={20} color="#fff" />
            </div>
            <span className="brand-name">Aetheria</span>
          </div>

          <div className="left-headline">
            <div className="version-tag">
              <span className="version-dot" />
              v1.0 · Every Aether, One Platform
            </div>
            <h2>
              Every corner of<br />
              <strong>IT operations,</strong><br />
              unified.
            </h2>
            <p>
              Aetheria brings every IT role together —
              network engineers, managers, sysadmins, and
              procurement teams — one platform, every Aether.
            </p>
          </div>

          <div className="stat-row">
            <div className="stat-card">
              <div className="stat-value">Infra</div>
              <div className="stat-label">Infrastructure Aether</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">Network</div>
              <div className="stat-label">Network Aether</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">Assets</div>
              <div className="stat-label">Asset Aether</div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="form-card">
            {/* Mobile-only brand */}
            <div className="mobile-brand">
              <div className="brand-icon">
                <Activity size={18} color="#fff" />
              </div>
              <span className="brand-name">Aetheria</span>
            </div>

            <div className="form-heading">
              <h1>{isLogin ? 'Welcome back' : 'Create account'}</h1>
              <p>
                {isLogin
                  ? 'Sign in to your Aetheria workspace'
                  : 'Begin your Aetheria journey'}
              </p>
            </div>

            <div className="tab-switch">
              <button
                className={`tab-btn ${isLogin ? 'active' : ''}`}
                onClick={() => switchMode(true)}
              >
                Sign In
              </button>
              <button
                className={`tab-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => switchMode(false)}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="error-box">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="field">
                  <label><User size={11} /> Full Name</label>
                  <div className="field-input">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                      placeholder="Jane Smith"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div className="field">
                <label><Mail size={11} /> Email Address</label>
                <div className="field-input">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field">
                <label><Lock size={11} /> Password</label>
                <div className="field-input">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder={isLogin ? '••••••••' : 'Min. 8 characters'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">or</span>
              <span className="divider-line" />
            </div>

            <div className="form-footer">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <a onClick={() => switchMode(false)}>Create one</a>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <a onClick={() => switchMode(true)}>Sign in</a>
                </>
              )}
              <br />
              <span style={{ marginTop: 8, display: 'block' }}>
                By continuing you agree to our{' '}
                <a>Terms of Service</a> &amp; <a>Privacy Policy</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 