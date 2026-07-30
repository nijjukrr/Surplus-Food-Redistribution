import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRoleState] = useState(localStorage.getItem('foodbridge_role') || 'restaurant');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('foodbridge_role') || 'restaurant';
    const savedId = localStorage.getItem('foodbridge_user_id') || '11111111-1111-1111-1111-111111111111';
    
    let name = 'Royal Spice Bistro';
    if (savedRole === 'ngo') name = 'Care & Share Foundation';
    if (savedRole === 'volunteer') name = 'Alex Rivera';
    if (savedRole === 'admin') name = 'System Administrator';

    return {
      id: savedId,
      name,
      email: `${savedRole}@foodbridge.ai`,
      role: savedRole,
      is_verified: true
    };
  });

  const setRole = (newRole) => {
    localStorage.setItem('foodbridge_role', newRole);
    setRoleState(newRole);
    
    let name = 'Royal Spice Bistro';
    let id = '11111111-1111-1111-1111-111111111111';
    
    if (newRole === 'ngo') {
      name = 'Care & Share Foundation';
      id = '22222222-2222-2222-2222-222222222222';
    } else if (newRole === 'volunteer') {
      name = 'Alex Rivera';
      id = '33333333-3333-3333-3333-333333333333';
    } else if (newRole === 'admin') {
      name = 'System Administrator';
      id = '44444444-4444-4444-4444-444444444444';
    }

    localStorage.setItem('foodbridge_user_id', id);
    setUser({ id, name, email: `${newRole}@foodbridge.ai`, role: newRole, is_verified: true });
    setIsAuthenticated(true);
  };

  const login = (email, password, targetRole) => {
    setRole(targetRole || 'restaurant');
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
