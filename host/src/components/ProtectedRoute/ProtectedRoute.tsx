import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@shared/state';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
