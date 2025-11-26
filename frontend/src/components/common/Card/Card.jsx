import PropTypes from 'prop-types';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  padding = 'normal',
  hoverable = false,
  onClick,
  className = '',
  style = {}
}) => {
  // Clases base con diseño moderno
  const baseClasses = 'bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300';

  // Padding variants
  const paddingClasses = {
    compact: 'p-4',
    normal: 'p-6',
    comfortable: 'p-8'
  };

  // Hover effects
  const hoverClass = hoverable ? 'hover:shadow-2xl hover:-translate-y-1' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  const cardClasses = [
    baseClasses,
    paddingClasses[padding] || paddingClasses.normal,
    hoverClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick} style={style}>
      {(title || subtitle) && (
        <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          {title && (
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="text-slate-900 dark:text-slate-100">
        {children}
      </div>
      {footer && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  padding: PropTypes.oneOf(['compact', 'normal', 'comfortable']),
  hoverable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
};

export default Card;


