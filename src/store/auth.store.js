import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialStoreState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  permissions: [],
  role: null,
  isAuthenticated: false,
  isLoading: false,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialStoreState,

      login: (data) =>
        set({
          user: data?.user || null,
          accessToken: data?.accessToken || null,
          refreshToken: data?.refreshToken || null,
          permissions: data?.permissions || [],
          role: data?.role || null,
          isAuthenticated: true,
        }),

      logout: () => set(initialStoreState),

      setUser: (user) => set({ user }),

      setTokens: ({ accessToken, refreshToken }) =>
        set((state) => ({
          accessToken: accessToken !== undefined ? accessToken : state.accessToken,
          refreshToken: refreshToken !== undefined ? refreshToken : state.refreshToken,
        })),

      setPermissions: (permissions) => set({ permissions: permissions || [] }),

      setRole: (role) => set({ role }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : data,
        })),

      setLoading: (status) => set({ isLoading: status }),

      hasPermission: (permission) => {
        const userPermissions = get().permissions || [];
        return userPermissions.includes(permission);
      },

      hasAnyPermission: (permissionArray) => {
        const userPermissions = get().permissions || [];
        return permissionArray.some((perm) => userPermissions.includes(perm));
      },

      hasAllPermissions: (permissionArray) => {
        const userPermissions = get().permissions || [];
        return permissionArray.every((perm) => userPermissions.includes(perm));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        permissions: state.permissions,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
