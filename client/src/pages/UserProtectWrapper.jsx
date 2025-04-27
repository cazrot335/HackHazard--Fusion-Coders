import React, { useContext } from 'react';
import { AuthDataContext } from '../context/AuthContext';

import { Navigate } from 'react-router-dom';

const UserProtectWrapper = ({ children }) => {
  const { user } = useContext(AuthDataContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserProtectWrapper;
