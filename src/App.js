import React, { Suspense } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Personalize from './pages/Personalize';
import UserForm from './pages/UseForm';
import ImageUpload from './pages/ImageUpload';
import Optimize from './pages/Optimize';
import Manual from './pages/Manual';
import Settings from './pages/Settings';

const Onboarding = React.lazy(() => import('./pages/onboarding'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const PhotoInput = React.lazy(() => import('./pages/FormPhoto'))

const AppRoutes = () => {
  const routes = [
    { path: '/', element: <Onboarding /> },
    { path: '/auth', element: <AuthPage/> },
    { path: '/setting', element: <Settings/> },
    { path:'/ocr', element:<ProtectedRoute element={<PhotoInput/>} />},
    { path:'/personalize', element:<ProtectedRoute element={<Personalize/>}/>},
    { path:'/data', element:<ProtectedRoute element={<UserForm/>}/>},
    { path:'/photo', element:<ProtectedRoute element={<Optimize/>}/>},
    { path:'/manual', element:<ProtectedRoute element={<Manual/>}/>}
  ];

  return useRoutes(routes);
};

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </Router>
  );
};

export default App;
