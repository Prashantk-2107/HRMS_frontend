import React from 'react';
import { HelpCircle } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import AuthSlider from '../components/AuthSlider';

const LoginPage = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:h-screen w-full bg-white font-sans text-gray-800 lg:overflow-hidden">

            {/* Left panel: Logo, form, sign up, copyright */}
            <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between lg:h-screen bg-white">

                {/* Header */}
                <header className="flex justify-between items-center w-full">
                    <a href="#" className="flex items-center gap-2 text-xl sm:text-2xl font-black text-indigo-600 select-none no-underline" onClick={(e) => e.preventDefault()}>
                        <svg
                            className="text-indigo-600"
                            width="28"
                            height="28"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2ZM14.5 22.5V9.5L22 16L14.5 22.5Z"
                                fill="currentColor"
                            />
                        </svg>
                        Pagedone
                    </a>

                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 cursor-pointer p-1" aria-label="Help">
                            <HelpCircle size={20} />
                        </button>
                        <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600">
                            Don't have an account?
                            <a href="#signup" className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-lg border border-gray-200 transition-all duration-200 no-underline" onClick={(e) => e.preventDefault()}>
                                Sign Up
                            </a>
                        </div>
                    </div>
                </header>

                {/* Main form area */}
                <main className="flex-1 flex items-center justify-center py-4">
                    <LoginForm />
                </main>

                {/* Footer */}
                <footer className="flex justify-between items-center text-xs text-gray-400 mt-4">
                    <div>© 2024 Pagedone. All Rights Reserved.</div>
                    <button className="flex items-center gap-1 bg-transparent border-none text-gray-500 hover:text-gray-800 cursor-pointer transition-colors duration-200" onClick={(e) => e.preventDefault()}>
                        <span role="img" aria-label="flag">🇮🇳</span> IN ▾
                    </button>
                </footer>

            </div>

            {/* Right panel: Showcase slides & custom cards */}
            <div className="w-full lg:w-1/2 bg-slate-50/70 flex flex-col justify-center items-center p-8 sm:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-slate-100 min-h-[480px] lg:h-screen lg:overflow-hidden">
                <AuthSlider />
            </div>
        </div>
    );
};

export default LoginPage;
