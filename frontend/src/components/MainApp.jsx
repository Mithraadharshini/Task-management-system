import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import { CircularProgress, Box } from '@mui/material';

export default function MainApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return user ? <Dashboard /> : <AuthForm />;
}