import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { router } from './app/router';

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

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
        <ToastLimitManager />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
