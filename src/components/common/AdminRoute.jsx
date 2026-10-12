import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

export default function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader center text="Verifying admin credentials..." size="lg" />;
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
