import PropTypes from 'prop-types';
import styles from './Loading.module.css';

const Loading = ({
  message = 'Cargando...',
  size = 'medium',
  overlay = false
}) => {
  const content = (
    <div className={`${styles.loading} ${styles[size]}`}>
      <div className={styles.spinner} role="status" aria-label="Cargando"></div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className={styles.overlay}>
        {content}
      </div>
    );
  }

  return content;
};

Loading.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  overlay: PropTypes.bool
};

export default Loading;

