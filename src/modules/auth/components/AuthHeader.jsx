import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader = () => {
  return (
    <header className="flex justify-between items-center w-full">
      <Link
        to="/login"
        className="flex items-center gap-2 text-xl sm:text-2xl font-black text-indigo-600 select-none no-underline"
      >
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
        WorkSphere
      </Link>
    </header>
  );
};

export default AuthHeader;
