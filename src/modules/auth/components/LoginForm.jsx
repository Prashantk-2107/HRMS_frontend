import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../../../components/ui/Input';
import { useNavigate, Link } from 'react-router-dom';
import api, { AUTH_ENDPOINTS, PERMISSION_ENDPOINTS } from '../../../services/api';
import { useDispatch } from 'react-redux';
import { login, setPermissions } from '../../../store/slices/authSlice';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, {
        email: data.identifier,
        password: data.password
      });
      console.log('Login Response:', response.data);
      if (response.data.success) {
        dispatch(login({
          user: response?.data?.data?.employee,
          permissions: response?.data?.data?.permissions || [],
          role: response?.data?.data?.employee?.role,
          accessToken: response?.data?.data?.accessToken,
          refreshToken: response?.data?.data?.refreshToken,
        }));

        try {
          const empId = response?.data?.data?.employee?.emp_id;
          if (empId) {
            const permResponse = await api.get(PERMISSION_ENDPOINTS.GET_USER_PERMISSIONS(empId));
            console.log('Get User Permissions Response:', permResponse.data);

            if (permResponse.data.success) {
              const rawPermissions = permResponse.data.data?.effectivePermissions || [];

              // Convert to string array if objects are received
              const processedPermissions = Array.isArray(rawPermissions)
                ? rawPermissions.map(p => (p && typeof p === 'object' ? (p.name || p.codename || p.permission || p.title || JSON.stringify(p)) : p))
                : [];

              console.log('Processed Permissions:', processedPermissions);
              dispatch(setPermissions(processedPermissions));
            }
          } else {
            console.warn('Could not retrieve employee ID from login response.');
          }
        } catch (permError) {
          console.error('Failed to fetch permissions upon login:', permError);
        }

        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } else {
        toast.error(response?.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-[420px] mx-auto px-4 sm:px-0"
    >
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Login</h2>
        <p className="text-sm text-gray-500">Enter your details below to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input
          label="Email or Username"
          name="identifier"
          type="text"
          placeholder="ronaldrichards@pagedone.com"
          icon={Mail}
          required
          error={errors.identifier?.message}
          {...register('identifier', {
            required: 'Email or Username is required',
            minLength: {
              value: 3,
              message: 'Must be at least 3 characters long'
            }
          })}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••••••"
          icon={Lock}
          required
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long'
            }
          })}
        />

        <div className="flex justify-end items-center text-sm">
          <Link to="/forgot-password" className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors duration-200">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-3.5 px-4 rounded-lg text-base transition-all duration-200 cursor-pointer flex justify-center items-center mt-2.5 shadow-sm">
          Login
        </button>
      </form>
    </motion.div>
  );
};

export default LoginForm;
