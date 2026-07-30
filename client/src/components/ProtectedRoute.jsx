import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-rose-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your current persona role (<span className="text-rose-400 font-bold capitalize">{role}</span>) does not have authorization to view this protected portal.
          </p>
          <div className="pt-2">
            <Navigate to={`/${role}`} replace />
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
