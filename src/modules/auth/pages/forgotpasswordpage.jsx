import ForgotPasswordForm from '../components/forgotpasswordform';
import AuthSlider from '../components/authslider';
import AuthHeader from '../components/authheader';
import AuthFooter from '../components/authfooter';

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:h-screen w-full bg-white font-sans text-gray-800 lg:overflow-hidden">

      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-screen lg:h-screen bg-white mx-auto">

        <AuthHeader />

        <main className="flex-1 flex items-center justify-center py-4">
          <ForgotPasswordForm />
        </main>

        <AuthFooter />

      </div>

      <div className="hidden lg:flex w-full lg:w-1/2 bg-slate-50/70 flex-col justify-center items-center p-8 sm:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-slate-100 min-h-[480px] lg:h-screen lg:overflow-hidden">
        <AuthSlider />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
