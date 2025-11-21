import PropTypes from 'prop-types';
import styles from './Card.module.css';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  padding = 'normal',
  hoverable = false,
  onClick,
  className = ''
}) => {
  const cardClasses = [
    styles.card,
    padding === 'compact' && styles.compact,
    padding === 'comfortable' && styles.comfortable,
    hoverable && styles.hoverable,
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
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
  className: PropTypes.string
};

export default Card;

