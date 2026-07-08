import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { AUTH_ENDPOINTS } from '../../../services/api';
import Input from '../../../components/ui/input';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [direction, setDirection] = useState(1); // 1 = slide left (next), -1 = slide right (prev)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [tempToken, setTempToken] = useState('');

  // Local error state for OTP since it is handled outside react-hook-form
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const emailValue = watch('email');

  // Clear OTP error when typing
  useEffect(() => {
    if (otp.some(val => val !== '')) setOtpError('');
  }, [otp]);

  // Framer Motion slide variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  // Step 1: Submit Email
  const handleEmailSubmit = async (formData) => {
    const { email } = formData;
    setLoading(true);
    const toastId = toast.loading('Sending verification code...');
    try {
      // API call to request reset OTP
      const response = await api.post(AUTH_ENDPOINTS.SEND_OTP, { email, purpose: 'forget_password' });
      console.log('Forgot Password API Response:', response.data);

      const token = response.data?.data?.tempToken || response.data?.data?.temp_token || response.data?.tempToken;
      console.log('Received tempToken:', token);

      if (response.data?.success) {
        if (token) {
          setTempToken(token);
        }
        toast.success('Verification code sent to your email.', { id: toastId });
        setDirection(1);
        setStep(2);
      } else {
        toast.error(response.data?.message || 'Failed to send verification code.', { id: toastId });
      }
    } catch (error) {
      console.warn('API connection failed, activating fallback demo mode.', error);
      // Fallback for development/testing when backend endpoint is not yet ready
      if (error.response?.status === 404 || !error.response) {
        toast.success('Verification code sent! (Demo Mode)', { id: toastId });
        setTempToken('demo-temp-token-uuid');
        console.log('Using demo tempToken: demo-temp-token-uuid');
        setDirection(1);
        setStep(2);
      } else {
        toast.error(error.response?.data?.message || 'Something went wrong.', { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return; // Only allow single digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{1,6}$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setOtpError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Verifying OTP...');
    try {
      console.log("Otp is ", otpCode)
      console.log("tempToken is ", tempToken)
      console.log("emailValue is ", emailValue)
      const response = await api.post(AUTH_ENDPOINTS.VERIFY_OTP, {
        email: emailValue,
        otp_code: otpCode,
        tempToken: tempToken,
        purpose: 'forget_password'
      });
      console.log('Verify OTP API Response:', response.data);

      const token = response.data?.data?.tempToken || response.data?.data?.temp_token || response.data?.tempToken;
      console.log('Received tempToken in Verify OTP:', token);

      if (response.data?.success) {
        if (token) {
          setTempToken(token);
        }
        toast.success('OTP verified successfully!', { id: toastId });
        setDirection(1);
        setStep(3);
      } else {
        toast.error(response.data?.message || 'Invalid verification code.', { id: toastId });
      }
    } catch (error) {
      console.warn('API verification failed, activating fallback demo mode.', error);
      if (error.response?.status === 404 || !error.response) {
        toast.success('OTP verified! (Demo Mode)', { id: toastId });
        setDirection(1);
        setStep(3);
      } else {
        toast.error(error.response?.data?.message || 'Verification failed.', { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Submit New Password
  const handlePasswordSubmit = async (formData) => {
    const { newPassword } = formData;
    setLoading(true);
    const toastId = toast.loading('Resetting password...');
    try {
      const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        email: emailValue,
        tempToken: tempToken,
        password: newPassword
      });
      console.log('Reset Password API Response:', response.data);

      if (response.data?.success) {
        toast.success('Password changed successfully!', { id: toastId });
        setDirection(1);
        setStep(4);
      } else {
        toast.error(response.data?.message || 'Failed to change password.', { id: toastId });
      }
    } catch (error) {
      console.warn('API reset failed, activating fallback demo mode.', error);
      if (error.response?.status === 404 || !error.response) {
        toast.success('Password changed! (Demo Mode)', { id: toastId });
        setDirection(1);
        setStep(4);
      } else {
        toast.error(error.response?.data?.message || 'Failed to update password.', { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Redirection Effect
  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  const handleBack = () => {
    if (loading) return;
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 sm:px-0">
      <AnimatePresence mode="wait" custom={direction}>
        {step === 1 && (
          <motion.div
            key="step1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="mb-8 text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Forgot Password</h2>
              <p className="text-sm text-gray-500">Please enter your registered email ID</p>
            </div>

            <form onSubmit={handleSubmit(handleEmailSubmit)} className="flex flex-col gap-5" noValidate>
              <Input
                label="Email or Username"
                name="email"
                type="email"
                placeholder="ronaldrichards@pagedone.com"
                icon={Mail}
                required
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email or Username is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
              />

              <div className="text-xs text-gray-400 text-left mt-[-8px]">
                We will send a verification code to your registered email ID
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-3.5 px-4 rounded-lg text-base transition-all duration-200 cursor-pointer flex justify-center items-center mt-2.5 shadow-sm disabled:opacity-50 disabled:pointer-events-none gap-2"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{loading ? 'Sending...' : 'Next'}</span>
              </button>

              <div className="flex justify-center items-center text-sm mt-2">
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors duration-200 flex items-center gap-1.5"
                >
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="mb-8 text-left">
              <button
                onClick={handleBack}
                className="mb-4 text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-sm cursor-pointer border-none bg-transparent"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Enter OTP</h2>
              <p className="text-sm text-gray-500">Please enter the verification code</p>
            </div>

            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
              <div className="flex gap-1.5 sm:gap-3 justify-center my-2 w-full max-w-full">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-1 max-w-[56px] text-center text-lg sm:text-2xl font-bold border rounded-xl outline-none transition-all duration-200 bg-white
                      ${otpError
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10'
                      }`}
                  />
                ))}
              </div>

              {otpError && <div className="text-xs text-red-500 text-left mt-[-8px]">{otpError}</div>}

              <div className="text-xs text-gray-400 text-left">
                We have sent to verification code to your registered email ID: <span className="font-semibold text-gray-600">{emailValue}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-3.5 px-4 rounded-lg text-base transition-all duration-200 cursor-pointer flex justify-center items-center mt-2.5 shadow-sm disabled:opacity-50 disabled:pointer-events-none gap-2"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{loading ? 'Verifying...' : 'Next'}</span>
              </button>

              <div className="text-center text-sm text-gray-500 mt-2">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline border-none bg-transparent cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="mb-8 text-left">
              <button
                onClick={handleBack}
                className="mb-4 text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-sm cursor-pointer border-none bg-transparent"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">New Password</h2>
              <p className="text-sm text-gray-500">Please enter a new password</p>
            </div>

            <form onSubmit={handleSubmit(handlePasswordSubmit)} className="flex flex-col gap-5" noValidate>
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="••••••••••••"
                icon={Lock}
                required
                error={errors.newPassword?.message}
                {...register('newPassword', {
                  required: 'New Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long'
                  }
                })}
              />

              <Input
                label="Re-enter Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••••••"
                icon={Lock}
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) => value === watch('newPassword') || 'Passwords do not match'
                })}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-3.5 px-4 rounded-lg text-base transition-all duration-200 cursor-pointer flex justify-center items-center mt-4 shadow-sm disabled:opacity-50 disabled:pointer-events-none gap-2"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{loading ? 'Updating...' : 'Change Password'}</span>
              </button>
            </form>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
              className="text-emerald-500 mb-6"
            >
              <CheckCircle2 size={72} strokeWidth={1.5} />
            </motion.div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2.5">Password Changed!</h2>
            <p className="text-sm text-gray-500 max-w-[320px] leading-relaxed">
              Your password has been successfully updated. You are now being redirected to the login page.
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              Redirecting...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPasswordForm;
