// Estilos compartidos que usan variables CSS para soporte de temas

export const containerStyle = {
  width: '100%',
  padding: '2rem',
  minHeight: 'calc(100vh - 80px)',
  backgroundColor: 'var(--bg-secondary)',
  transition: 'background-color 0.3s ease'
};

export const cardStyle = {
  backgroundColor: 'var(--bg-card)',
  borderRadius: '0.75rem',
  boxShadow: 'var(--shadow-md)',
  padding: '1.5rem',
  transition: 'all 0.3s ease',
  border: '1px solid var(--border-color)'
};

export const titleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  marginBottom: '0.5rem',
  transition: 'color 0.3s ease'
};

export const subtitleStyle = {
  color: 'var(--text-secondary)',
  fontSize: '1rem',
  transition: 'color 0.3s ease'
};

export const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  transition: 'all 0.2s ease',
  outline: 'none'
};

export const inputFocusStyle = {
  ...inputStyle,
  borderColor: 'var(--primary-blue-light)',
  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
};

export const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.5rem',
  fontWeight: '500',
  color: 'var(--text-primary)',
  fontSize: '0.875rem',
  transition: 'color 0.3s ease'
};

export const buttonPrimaryStyle = {
  backgroundColor: 'var(--primary-blue)',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-sm)'
};

export const buttonSuccessStyle = {
  ...buttonPrimaryStyle,
  backgroundColor: 'var(--success-green)'
};

export const buttonDangerStyle = {
  ...buttonPrimaryStyle,
  backgroundColor: 'var(--danger-red)'
};

export const buttonWarningStyle = {
  ...buttonPrimaryStyle,
  backgroundColor: 'var(--warning-orange)'
};

export const buttonSecondaryStyle = {
  backgroundColor: 'var(--bg-tertiary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease'
};

export const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.25rem 0.75rem',
  borderRadius: '9999px',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: 'white',
  transition: 'all 0.2s ease'
};

export const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'var(--overlay-bg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
  animation: 'fadeIn 0.2s ease-out'
};

export const modalContentStyle = {
  backgroundColor: 'var(--bg-card)',
  borderRadius: '1rem',
  maxWidth: '800px',
  width: '100%',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: 'var(--shadow-xl)',
  border: '1px solid var(--border-color)',
  animation: 'slideIn 0.3s ease-out'
};

export const selectStyle = {
  padding: '0.5rem 1rem',
  border: '1px solid var(--border-color)',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  outline: 'none'
};

export const formGroupStyle = {
  marginBottom: '1.5rem'
};

export const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.5rem',
  width: '100%'
};

