import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import Input from '../../../components/ui/Input';

const LoginForm = () => {
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

  const onSubmit = (data) => {
    console.log('Form Submitted Data:', data);
    alert('Form is valid! Data: ' + JSON.stringify(data));
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 sm:px-0">
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Get Started</h2>
        <p className="text-sm text-gray-500">Enter your personal details below to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        {/* Email or Username field */}
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

        {/* Password field */}
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

        {/* Actions row: Forgot Password link only */}
        <div className="flex justify-end items-center text-sm">
          <a href="#forgot" className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors duration-200" onClick={(e) => e.preventDefault()}>
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-3.5 px-4 rounded-lg text-base transition-all duration-200 cursor-pointer flex justify-center items-center mt-2.5 shadow-sm">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
