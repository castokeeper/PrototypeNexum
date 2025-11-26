import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon,
  className = '',
  ...props
}) => {
  // Estilos base del botón
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variantes de color
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500/30 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500/30 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500/30 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500/30 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 focus:ring-slate-500/30 shadow hover:shadow-lg',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-500 dark:hover:text-white focus:ring-primary-500/30'
  };

  // Tamaños
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  // Ancho completo
  const widthClass = fullWidth ? 'w-full' : '';

  // Loading state
  const loadingClass = loading ? 'opacity-75 cursor-wait' : '';

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    loadingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'success', 'danger', 'warning', 'secondary', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  icon: PropTypes.node,
  className: PropTypes.string
};

export default Button;

