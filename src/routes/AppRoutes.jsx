import React from 'react';
import { useRoutes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Regular imports for small/static pages — keep imports at top to satisfy ESLint
import Personalize from '../pages/Personalize/Personalize';
import UserForm from '../pages/UseForm/UseForm';
import Optimize from '../pages/Optimize/Optimize';
import Manual from '../pages/Manual/Manual';
import Settings from '../pages/Settings/Settings';

// Lazy-loaded pages (keep heavy pages lazy)
const Onboarding = React.lazy(() => import('../pages/onboarding'));
const AuthPage = React.lazy(() => import('../pages/AuthPage'));
const PhotoInput = React.lazy(() => import('../pages/FormPhoto'));

const AppRoutes = () => {
  const routes = [
    { path: '/', element: <Onboarding /> },
    { path: '/auth', element: <AuthPage /> },
    { path: '/setting', element: <Settings /> },
    { path: '/ocr', element: <ProtectedRoute element={<PhotoInput />} /> },
    { path: '/personalize', element: <ProtectedRoute element={<Personalize />} /> },
    { path: '/data', element: <ProtectedRoute element={<UserForm />} /> },
    { path: '/photo', element: <ProtectedRoute element={<Optimize />} /> },
    { path: '/manual', element: <ProtectedRoute element={<Manual />} /> },
  ];

  return useRoutes(routes);
};

export default AppRoutes;
