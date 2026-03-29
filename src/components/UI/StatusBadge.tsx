interface StatusBadgeProps {
  status: string;
  label?: string;
  color?: string;
  size?: 'sm' | 'md';
}

// Maps to CSS class suffixes: nf-badge-{color}
const STATUS_COLOR: Record<string, string> = {
  active:           'green',
  connected:        'green',
  available:        'green',
  created:          'green',
  planned:          'blue',
  staged:           'cyan',
  staging:          'cyan',
  updated:          'blue',
  user:             'blue',
  'in-use':         'blue',
  dhcp:             'cyan',
  slaac:            'cyan',
  provisioning:     'amber',
  maintenance:      'amber',
  decommissioning:  'amber',
  deprovisioning:   'amber',
  offline:          'gray',
  decommissioned:   'gray',
  deprecated:       'gray',
  retired:          'gray',
  inactive:         'gray',
  read_only:        'gray',
  container:        'gray',
  failed:           'red',
  deleted:          'red',
  admin:            'red',
  reserved:         'cyan',
};

const COLOR_DOT: Record<string, string> = {
  green: '#34d399',
  blue:  '#93AFFF',
  red:   '#f87171',
  gray:  '#6b7280',
  amber: '#fbbf24',
  cyan:  '#22d3ee',
};

export function StatusBadge({ status, label, color, size = 'md' }: StatusBadgeProps) {
  const resolvedColor = color ?? STATUS_COLOR[status] ?? 'gray';
  const dot = COLOR_DOT[resolvedColor] ?? '#6b7280';
  const displayLabel = label ?? status;

  const padX = size === 'sm' ? '7px' : '10px';
  const padY = size === 'sm' ? '2px' : '3px';
  const fontSize = '11px';

  const colorStyles: Record<string, React.CSSProperties> = {
    green: { background: 'rgba(16,185,129,0.1)',  color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' },
    blue:  { background: 'rgba(79,110,247,0.12)',  color: '#93AFFF', border: '1px solid rgba(96,165,250,0.2)' },
    red:   { background: 'rgba(239,68,68,0.1)',   color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' },
    gray:  { background: 'rgba(255,255,255,0.05)',color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' },
    amber: { background: 'rgba(245,158,11,0.1)',  color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' },
    cyan:  { background: 'rgba(6,182,212,0.1)',   color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' },
  };

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: `${padY} ${padX}`,
    borderRadius: '20px',
    fontSize,
    fontWeight: 600,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap',
    ...(colorStyles[resolvedColor] ?? colorStyles.gray),
  };

  return (
    <span style={style}>
      <span style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: dot,
        flexShrink: 0,
        display: 'inline-block',
      }} />
      {displayLabel}
    </span>
  );
}