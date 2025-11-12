import PropTypes from 'prop-types';
import { AlertCircle } from 'lucide-react';
import styles from './Input.module.css';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  icon,
  className = '',
  ...props
}) => {
  const inputClasses = [
    styles.input,
    error && styles.error,
    icon && styles.inputWithIcon,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label htmlFor={name} className={required ? `${styles.label} ${styles.required}` : styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          {...props}
        />
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      {error && (
        <span id={`${name}-error`} className={styles.errorMessage} role="alert">
          <AlertCircle size={16} />
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${name}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string
};

export default Input;

