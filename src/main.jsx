import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AuthProvider from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import ImportData from './Pages/ImportData';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage /> 
  },
  {
    path: '/Login',
    element: <Login />
  },
  {
    path: '/Dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
  },
  {
    path: '/ImportData',
    element: <ProtectedRoute><ImportData /></ProtectedRoute> 
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> 
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);