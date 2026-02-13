// @ts-check
import { createContext, useContext, useReducer } from 'react';
import { auth, profile } from './services/api';
import { config } from './config';

/**
 * Estado inicial do store
 */
const initialState = {
  user: null,
  loading: false,
  error: null
};

/**
 * Tipos de ações
 */
export const actions = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT'
};

/**
 * Reducer para o store
 */
function reducer(state, action) {
  switch (action.type) {
    case actions.SET_USER:
      return { ...state, user: action.payload, error: null };
    case actions.SET_LOADING:
      return { ...state, loading: action.payload };
    case actions.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case actions.CLEAR_ERROR:
      return { ...state, error: null };
    case actions.LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}

/**
 * Contexto do store
 */
const StoreContext = createContext(null);

/**
 * Provider do store
 */
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Login com e-mail e senha
   */
  const login = async (email, password, turnstileToken) => {
    try {
      dispatch({ type: actions.SET_LOADING, payload: true });
      dispatch({ type: actions.CLEAR_ERROR });

      const { token, user } = await auth.login(email, password, turnstileToken);

      localStorage.setItem(config.storage.authToken, token);
      localStorage.setItem(config.storage.userData, JSON.stringify(user));

      dispatch({ type: actions.SET_USER, payload: user });
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  /**
   * Registro de novo usuário
   */
  const register = async (userData, turnstileToken) => {
    try {
      dispatch({ type: actions.SET_LOADING, payload: true });
      dispatch({ type: actions.CLEAR_ERROR });

      await auth.register(userData, turnstileToken);
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  /**
   * Recuperação de senha
   */
  const recover = async (email, turnstileToken) => {
    try {
      dispatch({ type: actions.SET_LOADING, payload: true });
      dispatch({ type: actions.CLEAR_ERROR });

      await auth.recover(email, turnstileToken);
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  /**
   * Atualiza perfil do usuário
   */
  const updateProfile = async (changes) => {
    try {
      dispatch({ type: actions.SET_LOADING, payload: true });
      dispatch({ type: actions.CLEAR_ERROR });

      const updatedUser = await profile.update(changes);
      dispatch({ type: actions.SET_USER, payload: updatedUser });
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  /**
   * Logout do usuário
   */
  const logout = () => {
    localStorage.removeItem(config.storage.authToken);
    localStorage.removeItem(config.storage.userData);
    dispatch({ type: actions.LOGOUT });
  };

  const value = {
    ...state,
    login,
    register,
    recover,
    updateProfile,
    logout
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

/**
 * Hook para acessar o store
 */
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

/**
 * Hook para lidar com erros
 */
export function useError() {
  const { error, dispatch } = useContext(StoreContext);
  const clearError = () => dispatch({ type: actions.CLEAR_ERROR });
  return [error, clearError];
}

/**
 * Hook para status de carregamento
 */
export function useLoading() {
  const { loading } = useContext(StoreContext);
  return loading;
}

/**
 * Hook para dados do usuário
 */
export function useUser() {
  const { user } = useContext(StoreContext);
  return user;
}