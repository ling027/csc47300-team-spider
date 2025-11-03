import { ReactNode, useEffect,useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import {toast} from "react-hot-toast";

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
  const prevIsLoggedIn = useRef(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn && prevIsLoggedIn.current) {
      alert("You are already logged in.");
    }
    prevIsLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
