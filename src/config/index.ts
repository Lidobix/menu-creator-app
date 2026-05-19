export const BREAKPOINTS = {
  desktop: 1024,
} as const;

export const COLORS = {
  // Brand
  primary: '#C1121F',
  primaryLight: '#FEE2E2',

  // Navigation sidebar
  sidebarBg: '#1A1A2E',
  sidebarText: '#FFFFFF',
  sidebarTextMuted: 'rgba(255,255,255,0.55)',
  sidebarTextInactive: 'rgba(255,255,255,0.45)',

  // Layout
  background: '#F8F9FA',
  surface: '#FFFFFF',

  // Typography
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Pizza base — badge
  tomateBadgeBg: '#FEE2E2',
  tomateBadgeText: '#991B1B',
  cremeBadgeBg: '#FEF9C3',
  cremeBadgeText: '#854D0E',

  // Pizza base — selection card
  tomateCardBg: '#FEF2F2',
  tomateCardBorder: '#FECACA',
  cremeCardBg: '#FFFBEB',
  cremeCardBorder: '#FDE68A',

  // Semantic
  success: '#059669',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningBorder: '#F59E0B',
  warningText: '#92400E',

  // Step progress indicator
  stepActive: '#C1121F',
  stepComplete: '#6EE7B7',
  stepPending: '#E5E7EB',

  // Tab bar
  tabBarBg: '#FFFFFF',
  tabBarInactive: '#9CA3AF',
} as const;

export const LAYOUT = {
  sidebarWidth: 240,
  tabBarHeight: 64,
  contentMaxWidth: 600,
  contentPadding: 24,
} as const;

// Use boxShadow (CSS) instead of deprecated shadow* props for React Native Web
export const SHADOWS = {
  sm: '0px 1px 4px rgba(0, 0, 0, 0.08)',
  md: '0px 2px 8px rgba(0, 0, 0, 0.06)',
  lg: '0px 2px 10px rgba(0, 0, 0, 0.07)',
  dropdown: '0px 4px 12px rgba(0, 0, 0, 0.08)',
  primaryBtn: '0px 4px 8px rgba(193, 18, 31, 0.3)',
} as const;
