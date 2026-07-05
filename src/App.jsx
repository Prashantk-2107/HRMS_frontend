import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { router } from './app/router';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// ToastLimitManager ensures that only the latest toast is shown on screen
function ToastLimitManager() {
  const { toasts } = useToasterStore();

  useEffect(() => {
    const visibleToasts = toasts.filter((t) => t.visible);
    if (visibleToasts.length > 1) {
      // Sort by createdAt descending (newest first) to guarantee correct ordering
      const sorted = [...visibleToasts].sort((a, b) => b.createdAt - a.createdAt);
      // Dismiss all except the newest visible toast (index 0)
      const toastsToDismiss = sorted.slice(1);
      toastsToDismiss.forEach((t) => toast.dismiss(t.id));
    }
  }, [toasts]);

  return null;
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: theme === 'dark' ? {
            background: '#0f172a', // slate-900
            color: '#f8fafc', // slate-50
            border: '1px solid #1e293b', // slate-800
          } : undefined
        }}
      />
      <ToastLimitManager />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
