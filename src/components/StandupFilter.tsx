import React from 'react';
import { Search, Filter } from 'lucide-react';

interface StandupFilterProps {
  onSearchChange: (value: string) => void;
  onUserFilterChange: (value: string) => void;
  users: { id: string; name: string; }[];
}

export const StandupFilter: React.FC<StandupFilterProps> = ({
  onSearchChange,
  onUserFilterChange,
  users,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search standups..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <select
          onChange={(e) => onUserFilterChange(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};