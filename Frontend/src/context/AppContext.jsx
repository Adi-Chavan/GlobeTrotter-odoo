import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

const initialState = {
  user: null,
  trips: [],
  isAuthenticated: false,
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_TRIPS':
      return { ...state, trips: action.payload };
    case 'ADD_TRIP':
      return { ...state, trips: [...state.trips, action.payload] };
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.id === action.payload.id ? action.payload : trip
        )
      };
    case 'DELETE_TRIP':
      return {
        ...state,
        trips: state.trips.filter(trip => trip.id !== action.payload)
      };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Check for existing auth token on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await api.getCurrentUser();
      const trips = await api.getTrips();
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_TRIPS', payload: trips });
    } catch (error) {
      console.error('Failed to load user data:', error);
      localStorage.removeItem('authToken');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.login(email, password);
      localStorage.setItem('authToken', response.token);
      dispatch({ type: 'SET_USER', payload: response.user });
      const trips = await api.getTrips();
      dispatch({ type: 'SET_TRIPS', payload: trips });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signup = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.signup(userData);
      localStorage.setItem('authToken', response.token);
      dispatch({ type: 'SET_USER', payload: response.user });
      dispatch({ type: 'SET_TRIPS', payload: [] });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      localStorage.removeItem('authToken');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.removeItem('authToken');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const createTrip = async (tripData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newTrip = await api.createTrip(tripData);
      dispatch({ type: 'ADD_TRIP', payload: newTrip });
      return newTrip;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateTrip = async (tripId, updates) => {
    try {
      const updatedTrip = await api.updateTrip(tripId, updates);
      dispatch({ type: 'UPDATE_TRIP', payload: updatedTrip });
      return updatedTrip;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await api.deleteTrip(tripId);
      dispatch({ type: 'DELETE_TRIP', payload: tripId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    createTrip,
    updateTrip,
    deleteTrip,
    clearError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}