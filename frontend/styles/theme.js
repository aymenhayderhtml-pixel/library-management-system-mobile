// Central color palette and shared styles
export const colors = {
  primary: '#2563EB',      // Blue
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
  secondary: '#10B981',    // Green
  danger: '#EF4444',
  warning: '#F59E0B',
  text: '#1F2937',
  textLight: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  background: '#F9FAFB',
  white: '#FFFFFF',
  card: '#FFFFFF',
  overdue: '#FEE2E2',
  overdueText: '#DC2626',
  safe: '#D1FAE5',
  safeText: '#065F46',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', color: colors.text },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text },
  h3: { fontSize: 18, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, color: colors.text },
  small: { fontSize: 13, color: colors.textLight },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
};
