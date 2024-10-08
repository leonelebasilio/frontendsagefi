import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AuthProvider from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import ImportData from './Pages/ImportDataPage';
import SignUp from './Pages/SignUp';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import TemplatePage from './Pages/TemplatePage';
import TransactionsPage from './Pages/TransactionsPage';
import PersonalPage from './Pages/PersonalDataPage';
import BuscarPage from './Pages/BuscarPage';
import InvestmentsPage from './Pages/InvestmentsPage';
import GoalsPage from './Pages/GoalsPage';
import HelpPage from './Pages/HelpPage';
import AlertPage from './Pages/AlertPage';
import CompanyDataPage from './Pages/CompanyDataPage';
import MyPlanPage from './Pages/MyPlanPage';
import Settings from './Pages/Settings';

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
    path: '/SignUp',
    element: <SignUp />
  },

  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },

  {
    path: '/reset-password/:token',
    element: <resetPassword />
  },

  {
    path: '/TemplatePage',
    element: <ProtectedRoute><TemplatePage /></ProtectedRoute> 
  },

  {
    path: '/Transactions',
    element: <ProtectedRoute><TransactionsPage /></ProtectedRoute> 
  },

  {
    path: '/Personal-data',
    element: <ProtectedRoute><PersonalPage /></ProtectedRoute> 
  },

  {
    path: '/BuscarPage',
    element: <ProtectedRoute><BuscarPage /></ProtectedRoute> 
  },

  {
    path: '/Investments',
    element: <ProtectedRoute><InvestmentsPage /></ProtectedRoute> 
  },

  {
    path: '/Goals',
    element: <ProtectedRoute><GoalsPage /></ProtectedRoute> 
  },

  {
    path: '/Help',
    element: <ProtectedRoute><HelpPage /></ProtectedRoute> 
  },

  {
    path: '/Alert',
    element: <ProtectedRoute><AlertPage /></ProtectedRoute> 
  },


  {
    path: '/Company-data',
    element: <ProtectedRoute><CompanyDataPage /></ProtectedRoute> 
  },


  {
    path: '/my-plan',
    element: <ProtectedRoute><MyPlanPage /></ProtectedRoute> 

  },

  
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute> 
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