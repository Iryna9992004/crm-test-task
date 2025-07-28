import { useForm } from 'react-hook-form';
import { useLogin } from '../../hooks/auth/useLogin';
import { useRegister } from '../../hooks/auth/useRegister';
import { toast } from 'react-toastify';
import styles from './auth-form.module.css';

interface AuthFormProps {
  mode: 'login' | 'register';
}

interface FormValues {
  email: string;
  password: string;
  username?: string;
  githubKey?: string;
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const { register: formRegister, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const login = useLogin();
  const registerUser = useRegister();

  const onSubmit = async (data: FormValues) => {
    try {
      if (mode === 'login') {
        await login({ email: data.email, password: data.password });
      } else {
        await registerUser({
          email: data.email,
          password: data.password,
          username: data.username!,
          githubKey: data.githubKey!,
        });
      }
    } catch (error: any) {
      // Try to get the server's error message, fallback to Axios error message, then generic
      const serverMessage = error?.response?.data?.message;
      const axiosMessage = error?.message;
      toast.error(serverMessage || axiosMessage || 'Authentication failed');
    }
  };

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {mode === 'register' && (
          <>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>Username</label>
              <input
                type="text"
                className={styles.input}
                autoComplete="username"
                placeholder="Enter your username"
                {...formRegister('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                  maxLength: { value: 32, message: 'Max 32 characters' },
                })}
              />
              {errors.username && <div className={styles.error}>{errors.username.message}</div>}
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>GitHub Key</label>
              <input
                type="text"
                className={styles.input}
                autoComplete="off"
                placeholder="Enter your GitHub key"
                {...formRegister('githubKey', {
                  required: 'GitHub key is required',
                  minLength: { value: 10, message: 'Min 10 characters' },
                  maxLength: { value: 128, message: 'Max 128 characters' },
                })}
              />
              {errors.githubKey && <div className={styles.error}>{errors.githubKey.message}</div>}
            </div>
          </>
        )}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            autoComplete="email"
            placeholder="Enter your email"
            {...formRegister('email', { required: 'Email is required', pattern: { value: /.+@.+\..+/, message: 'Invalid email' } })}
          />
          {errors.email && <div className={styles.error}>{errors.email.message}</div>}
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="Enter your password"
            {...formRegister('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
          />
          {errors.password && <div className={styles.error}>{errors.password.message}</div>}
        </div>
        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
