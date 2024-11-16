import React, { Suspense } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

// Lazy load pages
const Onboarding = React.lazy(() => import('./pages/onboarding'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const PhotoInput = React.lazy(() => import('./pages/FormPhoto'))

const AppRoutes = () => {
  // Define routes for the app
  const routes = [
    { path: '/', element: <Onboarding /> },
    { path: '/auth', element: <AuthPage /> },
    { path:'/photo', element:<PhotoInput/>}
  ];

  // useRoutes to handle routing
  return useRoutes(routes);
};

const App = () => {
  return (
    <Router>
      {/* Suspense for lazy loading with fallback UI */}
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </Router>
  );
};

export default App;
