export const sectionStyle = {
  backgroundColor: '#F9FAFB',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px'
};

export const sectionTitleStyle = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em'
};

export const inputGroupStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '12px'
};

export const inputStyle = (hasError: boolean) => ({
  width: '100%',
  padding: '8px 12px',
  borderRadius: '6px',
  border: `1px solid ${hasError ? '#EF4444' : '#D1D5DB'}`,
  outline: 'none',
  fontSize: '0.875rem'
});

export const labelStyle = {
  display: 'block',
  marginBottom: '4px',
  fontWeight: 500,
  fontSize: '0.875rem',
  color: '#374151'
};
