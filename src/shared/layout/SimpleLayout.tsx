import React from 'react';
import { Outlet } from 'react-router-dom';

export const SimpleLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
}; 