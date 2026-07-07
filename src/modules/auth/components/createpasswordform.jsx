import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../../../components/ui/input';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api, { AUTH_ENDPOINTS } from '../../../services/api';
import toast from 'react-hot-toast';

const CreatePasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    if (!email || !token) {
      toast.error('Missing email or verification token.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Setting up your password...');
    try {
      const response = await api.post(AUTH_ENDPOINTS.CREATE_PASSWORD, {
        email,
        password: data.password,
        token
      });

      if (response.data.success || response.status === 200) {
        toast.success('Password set up successfully! You can now log in.', { id: toastId });
        navigate('/login');
      } else {
        toast.error(response.data?.message || 'Failed to set up password', { id: toastId });
      }
    } catch (error) {
      console.error('Password Setup Error:', error);
      toast.error(error.response?.data?.message || 'Failed to set up password. Link may be invalid or expired.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInvalid = !email || !token;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-[420px] mx-auto px-4 sm:px-0"
    >
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Set Up Password</h2>
        <p className="text-sm text-gray-500">
          {isInvalid 
            ? 'Access denied due to invalid setup link' 
            : `Set password for ${email}`
          }
        </p>
      </div>

      {isInvalid ? (
        <div className="flex flex-col gap-4 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert size={18} />
            <span>Invalid Invitation Link</span>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed">
            The account setup link is invalid, incomplete, or has expired. Please check your email or ask your administrator to resend the setup link.
          </p>
          <Link
            to="/login"
            className="w-full text-center bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-all duration-200 mt-2"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <Input
            label="New Password"
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

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••••••"
            icon={Lock}
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match'
            })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 text-white font-semibold py-3.5 px-4 rounded-lg text-base transition-all duration-200 cursor-pointer flex justify-center items-center mt-2.5 shadow-sm"
          >
            {isSubmitting ? 'Setting up...' : 'Create Account'}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default CreatePasswordForm;
