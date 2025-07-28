import AuthForm from '../../features/auth-form/AuthForm';
import { Link } from 'react-router-dom';
import styles from './login.module.css';
import formStyles from '../../features/auth-form/auth-form.module.css';

const Login = () => {
  return (
    <div className={styles.wrapper}>
      <div>
        <h2 className={formStyles.title}>Login</h2>
        <AuthForm mode="login" />
        <p style={{ marginTop: '1rem' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
