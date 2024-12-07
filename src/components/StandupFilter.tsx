import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface StandupFilterProps {
  onSearchChange: (value: string) => void;
  onUserFilterChange: (value: string) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  searchQuery: string;
  userFilter: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  users: { id: string; name: string; }[];
}

export const StandupFilter: React.FC<StandupFilterProps> = ({
  onSearchChange,
  onUserFilterChange,
  onDateRangeChange,
  searchQuery,
  userFilter,
  dateRange,
  users,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Convert string dates to Date objects
  const startDate = dateRange.startDate ? new Date(dateRange.startDate) : new Date();
  const endDate = dateRange.endDate ? new Date(dateRange.endDate) : new Date();

  // Handle click outside date picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateRangeChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    onDateRangeChange(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    );
  };

  const formatDateDisplay = () => {
    if (!dateRange.startDate && !dateRange.endDate) return 'Select date range';
    if (dateRange.startDate === dateRange.endDate) {
      return format(new Date(dateRange.startDate), 'MMM dd, yyyy');
    }
    return `${format(new Date(dateRange.startDate), 'MMM dd, yyyy')} - ${format(new Date(dateRange.endDate), 'MMM dd, yyyy')}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and User Filter Row */}
      <div className="flex flex-col sm:flex-row w-full gap-4">
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search standups..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        
        <div className="w-full sm:w-48">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <select
              value={userFilter}
              onChange={(e) => onUserFilterChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Date Range Picker */}
        <div className="w-full sm:w-auto">
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full sm:w-64 flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
              <span className="truncate">{formatDateDisplay()}</span>
            </button>

            {showDatePicker && (
              <div
                ref={datePickerRef}
                className="absolute right-0 z-50 mt-2 w-full sm:w-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <DateRange
                  ranges={[{
                    startDate,
                    endDate,
                    key: 'selection'
                  }]}
                  onChange={handleDateRangeChange}
                  months={1}
                  direction="horizontal"
                  className="rounded-lg"
                  rangeColors={['#3b82f6']}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};