import React from 'react';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, AlertCircle, MessageSquare, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Standup } from '../types/standup';
import { Button } from './Button';
import { useCardMenu } from '../hooks/useCardMenu';
import { patterns } from '../styles/patterns';
import { useTheme } from '../contexts/ThemeContext';

interface StandupCardProps {
  standup: Standup;
  onEdit: (standup: Standup) => void;
  onDelete: (id: string) => void;
}

export const StandupCard: React.FC<StandupCardProps> = ({ standup, onEdit, onDelete }) => {
  const { menuRef, isMenuOpen, toggleMenu, closeMenu } = useCardMenu();
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700" 
      style={theme === 'dark' ? patterns.cardDark : patterns.card}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {format(standup.date, 'MMM dd, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
            {standup.userName}
          </div>
          <div className="relative" ref={menuRef}>
            <Button
              variant="secondary"
              className="p-1.5"
              onClick={toggleMenu}
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(standup);
                      closeMenu();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(standup.id);
                      closeMenu();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
            Yesterday
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm pl-6">{standup.yesterday}</p>
        </div>
        
        <div>
          <h3 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
            Today
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm pl-6">{standup.today}</p>
        </div>
        
        {standup.blockers && (
          <div>
            <h3 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              <AlertCircle className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
              Blockers
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm pl-6">{standup.blockers}</p>
          </div>
        )}

        {standup.comments && (
          <div>
            <h3 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              <MessageSquare className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400" />
              Comments
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm pl-6">{standup.comments}</p>
          </div>
        )}
      </div>
    </div>
  );
};