
import { Link } from 'react-router-dom';
import styles from './register.module.css';
import formStyles from '../../features/auth-form/auth-form.module.css';
import AuthForm from '../../features/auth-form';

const Register = () => {
  return (
    <div className={styles.wrapper}>
      <div>
        <h2 className={formStyles.title}>Register</h2>
        <AuthForm mode="register" />
        <p style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 