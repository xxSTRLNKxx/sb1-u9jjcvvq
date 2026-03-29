import { Plus, type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  count?: number;
  onAdd?: () => void;
  addLabel?: string;
  actions?: React.ReactNode;
  icon?: LucideIcon;
}

export function PageHeader({
  title,
  subtitle,
  description,
  count,
  onAdd,
  addLabel = 'Add',
  actions,
  icon: Icon,
}: PageHeaderProps) {
  return (
    <>
      <style>{`
        .ph-root {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 32px;
        }
        .ph-left {}
        .ph-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(79,110,247,0.12);
          border: 1px solid rgba(79,110,247,0.25);
          border-radius: 20px;
          padding: 3px 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #93AFFF;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }
        .ph-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ph-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(79,110,247,0.15);
          border: 1px solid rgba(79,110,247,0.25);
          border-radius: 10px;
          color: #93AFFF;
          flex-shrink: 0;
        }
        .ph-title {
          font-size: 24px;
          font-weight: 700;
          color: #EEF2FF;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .ph-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #9ca3af;
          padding: 2px 10px;
          border-radius: 20px;
        }
        .ph-desc {
          margin: 8px 0 0;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
        }
        .ph-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          padding-top: 4px;
        }
        .ph-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: #4F6EF7;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(79,110,247,0.3);
        }
        .ph-add-btn:hover {
          background: #6175F8;
          box-shadow: 0 4px 20px rgba(97,117,248,0.5);
        }
        .ph-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin-bottom: 32px;
          margin-top: -16px;
        }
      `}</style>

      <div className="ph-root">
        <div className="ph-left">
          {subtitle && <div className="ph-tag">{subtitle}</div>}
          <div className="ph-title-row">
            {Icon && (
              <div className="ph-icon-wrap">
                <Icon size={17} />
              </div>
            )}
            <h1 className="ph-title">{title}</h1>
            {count !== undefined && (
              <span className="ph-count">{count}</span>
            )}
          </div>
          {description && <p className="ph-desc">{description}</p>}
        </div>

        <div className="ph-actions">
          {actions}
          {onAdd && (
            <button className="ph-add-btn" onClick={onAdd}>
              <Plus size={15} />
              {addLabel}
            </button>
          )}
        </div>
      </div>

      <div className="ph-divider" />
    </>
  );
}