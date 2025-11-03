import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): React.ReactElement {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    alert("You must be logged in to access this page.");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function SignedInProtection({ children }: ProtectedRouteProps): React.ReactElement {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    alert("You are already logged in.");
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

