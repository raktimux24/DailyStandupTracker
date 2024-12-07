import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { User } from 'lucide-react';

interface StatsCardsProps {
  standupStats: Array<{ user_id: string; total_standups: number }>;
  users: Array<{ id: string; name: string; }>;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ standupStats, users }) => {
  const { theme } = useTheme();

  // Create array of user stats with names
  const userStatsWithNames = standupStats.map(stat => ({
    userId: stat.user_id,
    name: users.find(u => u.id === stat.user_id)?.name || 'Unknown User',
    totalStandups: stat.total_standups
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {userStatsWithNames.map(({ userId, name, totalStandups }) => (
        <div
          key={userId}
          className="p-4 sm:p-6 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className={`text-sm sm:text-base font-medium truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{name}</p>
              <p className={`text-xl sm:text-2xl font-semibold mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{totalStandups}</p>
              <p className={`text-xs sm:text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>standups</p>
            </div>
            <div className={`p-3 rounded-full flex-shrink-0 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-100'
            }`}>
              <User className={
                theme === 'dark' ? 'text-white' : 'text-blue-600'
              } size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
