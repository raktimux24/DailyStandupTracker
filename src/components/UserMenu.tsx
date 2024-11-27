import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { useCardMenu } from '../hooks/useCardMenu';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const { menuRef, isMenuOpen, toggleMenu, closeMenu } = useCardMenu();

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="secondary"
        onClick={toggleMenu}
        className="flex items-center space-x-2"
      >
        <User className="w-5 h-5" />
        <span>{user?.name}</span>
      </Button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};