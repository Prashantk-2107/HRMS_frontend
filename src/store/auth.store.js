import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Initial state of the authentication store
const initialStoreState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  permissions: [],
  role: null,
  isAuthenticated: false,
  isLoading: false,
};

/**
 * Authentication Store using Zustand.
 * Manages user session state, tokens, loading states, and provides permission checking utility helpers.
 * Persists session data except the loading status in localStorage.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      ...initialStoreState,

      // Actions

      /**
       * Populates the store with user details, tokens, permissions, and roles from the API response
       * and sets authentication status to true.
       * @param {Object} data - The login response data containing user, tokens, role, and permissions
       */
      login: (data) =>
        set({
          user: data?.user || null,
          accessToken: data?.accessToken || null,
          refreshToken: data?.refreshToken || null,
          permissions: data?.permissions || [],
          role: data?.role || null,
          isAuthenticated: true,
        }),

      /**
       * Completely resets the store to its initial state, logging the user out.
       */
      logout: () => set(initialStoreState),

      /**
       * Sets or overrides the current user details.
       * @param {Object} user - The user object
       */
      setUser: (user) => set({ user }),

      /**
       * Updates access and refresh tokens in the state.
       * @param {Object} tokens - Object containing access and/or refresh token
       */
      setTokens: ({ accessToken, refreshToken }) =>
        set((state) => ({
          accessToken: accessToken !== undefined ? accessToken : state.accessToken,
          refreshToken: refreshToken !== undefined ? refreshToken : state.refreshToken,
        })),

      /**
       * Sets the list of user permissions.
       * @param {Array<string>} permissions - Array of permission strings
       */
      setPermissions: (permissions) => set({ permissions: permissions || [] }),

      /**
       * Sets the active user role.
       * @param {string|null} role - The user role
       */
      setRole: (role) => set({ role }),

      /**
       * Updates the existing user details by shallow merging the new data.
       * @param {Object} data - New user fields to merge
       */
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : data,
        })),

      /**
       * Sets the loading state.
       * @param {boolean} status - Loading status
       */
      setLoading: (status) => set({ isLoading: status }),

      /**
       * Helper to check if a specific permission exists.
       * @param {string} permission - The permission to check
       * @returns {boolean}
       */
      hasPermission: (permission) => {
        const userPermissions = get().permissions || [];
        return userPermissions.includes(permission);
      },

      /**
       * Helper to check if the user has any of the specified permissions.
       * @param {Array<string>} permissionArray - Array of permissions
       * @returns {boolean}
       */
      hasAnyPermission: (permissionArray) => {
        const userPermissions = get().permissions || [];
        return permissionArray.some((perm) => userPermissions.includes(perm));
      },

      /**
       * Helper to check if the user has all of the specified permissions.
       * @param {Array<string>} permissionArray - Array of permissions
       * @returns {boolean}
       */
      hasAllPermissions: (permissionArray) => {
        const userPermissions = get().permissions || [];
        return permissionArray.every((perm) => userPermissions.includes(perm));
      },
    }),
    {
      name: 'auth-storage',
      // Persist only key authentication state; omit volatile states like isLoading
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
