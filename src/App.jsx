import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './app/router';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
