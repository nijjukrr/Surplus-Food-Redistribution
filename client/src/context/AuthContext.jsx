import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const getDefaultName = (r) => {
  if (r === 'ngo') return 'Care & Share Foundation';
  if (r === 'volunteer') return 'Alex Rivera';
  if (r === 'admin') return 'System Administrator';
  return 'Royal Spice Bistro';
};

export const AuthProvider = ({ children }) => {
  const [role, setRoleState] = useState(localStorage.getItem('foodbridge_role') || 'restaurant');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('foodbridge_role') || 'restaurant';
    const savedId = localStorage.getItem('foodbridge_user_id') || '11111111-1111-1111-1111-111111111111';
    const savedName = localStorage.getItem('foodbridge_user_name') || getDefaultName(savedRole);

    return {
      id: savedId,
      name: savedName,
      email: `${savedRole}@foodbridge.ai`,
      role: savedRole,
      is_verified: true
    };
  });

  const setRole = (newRole, customName) => {
    localStorage.setItem('foodbridge_role', newRole);
    setRoleState(newRole);
    
    let id = '11111111-1111-1111-1111-111111111111';
    if (newRole === 'ngo') {
      id = '22222222-2222-2222-2222-222222222222';
    } else if (newRole === 'volunteer') {
      id = '33333333-3333-3333-3333-333333333333';
    } else if (newRole === 'admin') {
      id = '44444444-4444-4444-4444-444444444444';
    }

    const finalName = customName && customName.trim() ? customName.trim() : (localStorage.getItem('foodbridge_user_name') || getDefaultName(newRole));
    localStorage.setItem('foodbridge_user_id', id);
    localStorage.setItem('foodbridge_user_name', finalName);

    setUser({ id, name: finalName, email: `${newRole}@foodbridge.ai`, role: newRole, is_verified: true });
    setIsAuthenticated(true);
  };

  const login = (email, password, targetRole, customName) => {
    if (customName && customName.trim()) {
      localStorage.setItem('foodbridge_user_name', customName.trim());
    }
    setRole(targetRole || 'restaurant', customName);
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
