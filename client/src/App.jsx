import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import RestaurantDashboard from './pages/RestaurantDashboard';
import NgoDashboard from './pages/NgoDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Visitor Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />

          {/* Dedicated Restaurant Portal Protected Routes */}
          <Route
            path="/restaurant/*"
            element={
              <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dedicated NGO Hub Protected Routes */}
          <Route
            path="/ngo/*"
            element={
              <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                <NgoDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Volunteer Courier Protected Routes */}
          <Route
            path="/volunteer/*"
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Admin Control Center Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
