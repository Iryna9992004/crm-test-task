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
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const login = useLogin();
  const registerUser = useRegister();

  const onSubmit = async (data: FormValues) => {
    try {
      if (mode === 'login') {
        await login(data);
      } else {
        await registerUser(data);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Authentication failed');
    }
  };

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            autoComplete="email"
            placeholder="Enter your email"
            {...register('email', { required: 'Email is required', pattern: { value: /.+@.+\..+/, message: 'Invalid email' } })}
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
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
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
