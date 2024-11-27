import React, { useState } from 'react';
import { Button } from './Button';
import { Standup } from '../types/standup';

interface EditStandupFormProps {
  standup: Standup;
  onSubmit: (data: Standup) => void;
  onCancel: () => void;
}

export const EditStandupForm: React.FC<EditStandupFormProps> = ({
  standup,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    yesterday: standup.yesterday,
    today: standup.today,
    blockers: standup.blockers,
    comments: standup.comments,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...standup,
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="yesterday" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          What did you do yesterday?
        </label>
        <textarea
          id="yesterday"
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={formData.yesterday}
          onChange={(e) => setFormData(prev => ({ ...prev, yesterday: e.target.value }))}
          required
        />
      </div>

      <div>
        <label htmlFor="today" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          What will you do today?
        </label>
        <textarea
          id="today"
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={formData.today}
          onChange={(e) => setFormData(prev => ({ ...prev, today: e.target.value }))}
          required
        />
      </div>

      <div>
        <label htmlFor="blockers" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Any blockers?
        </label>
        <textarea
          id="blockers"
          rows={2}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          value={formData.blockers}
          onChange={(e) => setFormData(prev => ({ ...prev, blockers: e.target.value }))}
          placeholder="Optional"
        />
      </div>

      <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Additional Comments
        </label>
        <textarea
          id="comments"
          rows={2}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          value={formData.comments}
          onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
          placeholder="Any additional notes or comments"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};