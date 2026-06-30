import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  permissions: [],
  role: null,
  isAuthenticated: false,
  isLoading: false,
};

const loadInitialState = () => {
  try {
    const serialized = localStorage.getItem('auth-storage');
    if (serialized) {
      const parsed = JSON.parse(serialized);
      if (parsed && parsed.state) {
        return {
          ...defaultState,
          ...parsed.state,
          isLoading: false, // Ensure loading is false on refresh
        };
      }
    }
  } catch (e) {
    console.error('Error loading auth state from localStorage:', e);
  }
  return defaultState;
};

const saveState = (state) => {
  try {
    const dataToSave = {
      state: {
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        permissions: state.permissions,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      },
      version: 0,
    };
    localStorage.setItem('auth-storage', JSON.stringify(dataToSave));
  } catch (e) {
    console.error('Error saving auth state to localStorage:', e);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    login: (state, action) => {
      const data = action.payload;
      state.user = data?.user || null;
      state.accessToken = data?.accessToken || null;
      state.refreshToken = data?.refreshToken || null;
      state.permissions = data?.permissions || [];
      state.role = data?.role || null;
      state.isAuthenticated = true;
      saveState(state);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.permissions = [];
      state.role = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      saveState(state);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      saveState(state);
    },
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      if (accessToken !== undefined) {
        state.accessToken = accessToken;
      }
      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
      }
      saveState(state);
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload || [];
      saveState(state);
    },
    setRole: (state, action) => {
      state.role = action.payload;
      saveState(state);
    },
    updateUser: (state, action) => {
      const data = action.payload;
      state.user = state.user ? { ...state.user, ...data } : data;
      saveState(state);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  login,
  logout,
  setUser,
  setTokens,
  setPermissions,
  setRole,
  updateUser,
  setLoading,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectRole = (state) => state.auth.role;
export const selectPermissions = (state) => state.auth.permissions;

export default authSlice.reducer;
