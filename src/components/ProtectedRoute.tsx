// ProtectedRoute.tsx

import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return children;
}



// import { PropsWithChildren, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// import { useAuth } from './AuthProvider';

// type ProtectedRouteProps = PropsWithChildren;

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log('Usuário no ProtectedRoute:', user); 
//     if (!user) {
//       navigate('/Login', { replace: true });
//     }
//   }, [navigate, user]);

//   return children;
// }