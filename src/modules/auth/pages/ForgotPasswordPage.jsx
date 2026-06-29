import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import AuthSlider from '../components/AuthSlider';
import AuthHeader from '../components/AuthHeader';
import AuthFooter from '../components/AuthFooter';

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:h-screen w-full bg-white font-sans text-gray-800 lg:overflow-hidden">

      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between lg:h-screen bg-white">

        <AuthHeader />

        <main className="flex-1 flex items-center justify-center py-4">
          <ForgotPasswordForm />
        </main>

        <AuthFooter />

      </div>

      <div className="w-full lg:w-1/2 bg-slate-50/70 flex flex-col justify-center items-center p-8 sm:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-slate-100 min-h-[480px] lg:h-screen lg:overflow-hidden">
        <AuthSlider />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
