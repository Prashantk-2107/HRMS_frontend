import { Suspense } from 'react';
import Skeleton from '../ui/skeleton';

// Premium skeleton screen loader for interior page transitions
export const PageLoader = () => (
  <div className="p-6 space-y-6 text-left w-full h-full animate-pulse">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
    </div>
    <Skeleton className="h-96 rounded-2xl w-full" />
  </div>
);

// Minimal loader for auth login pages
export const AuthLoader = () => (
  <div className="min-h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
    <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6 animate-pulse">
      <div className="flex justify-center">
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <Skeleton className="h-12 rounded-xl w-full" />
      <Skeleton className="h-12 rounded-xl w-full" />
      <Skeleton className="h-12 rounded-xl w-full" />
    </div>
  </div>
);

export const withSuspense = (Component, isAuth = false) => (
  <Suspense fallback={isAuth ? <AuthLoader /> : <PageLoader />}>
    <Component />
  </Suspense>
);
