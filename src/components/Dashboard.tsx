import React, { useState, useMemo, useEffect } from 'react';
import { StandupCard } from './StandupCard';
import { StandupFilter } from './StandupFilter';
import { NewStandupForm } from './NewStandupForm';
import { EditStandupForm } from './EditStandupForm';
import { Modal } from './Modal';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { ClipboardList, Plus } from 'lucide-react';
import { Standup } from '../types/standup';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { StatsCards } from './StatsCards';

export const Dashboard: React.FC = () => {
  useDocumentTitle('Daily Standup Tracker');
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingStandup, setEditingStandup] = useState<Standup | null>(null);
  const [standups, setStandups] = useState<Standup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [standupStats, setStandupStats] = useState<Array<{ user_id: string; total_standups: number }>>([]);

  // Load standups from Supabase
  useEffect(() => {
    const loadStandups = async () => {
      try {
        // Load standups with user profiles
        const { data: standupData, error: fetchError } = await supabase
          .from('standups')
          .select(`
            id,
            created_at,
            user_id,
            yesterday,
            today,
            blockers,
            comments
          `);

        if (fetchError) {
          console.error('Error fetching standups:', fetchError);
          throw fetchError;
        }

        // Get all unique user IDs from standups
        const userIds = [...new Set(standupData.map(standup => standup.user_id))];
        
        // Fetch existing profiles
        const { data: userProfiles, error: userProfileError } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', userIds);

        if (userProfileError) {
          console.error('Error fetching user profiles:', userProfileError);
          throw userProfileError;
        }

        // Create a map of existing profiles
        const existingProfiles = new Map(
          userProfiles?.map(profile => [profile.id, profile]) || []
        );

        // If current user doesn't have a profile, create it
        if (user && !existingProfiles.has(user.id)) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous',
              email: user.email || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (profileError && profileError.code !== '23505') {
            console.error('Error creating current user profile:', profileError);
          } else {
            // Add the new profile to our map
            existingProfiles.set(user.id, {
              id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous',
              email: user.email || ''
            });
          }
        }

        // Create a map for all user IDs, using placeholder names for missing profiles
        const userProfileMap = new Map(
          userIds.map(userId => [
            userId,
            existingProfiles.get(userId) || {
              id: userId,
              name: `User ${userId.slice(0, 8)}`,
              email: ''
            }
          ])
        );

        const formattedStandups: Standup[] = standupData.map(item => {
          const userProfile = userProfileMap.get(item.user_id);
          
          return {
            id: item.id,
            date: new Date(item.created_at),
            userId: item.user_id,
            userName: userProfile?.name || `User ${item.user_id.slice(0, 8)}`,
            yesterday: item.yesterday || '',
            today: item.today || '',
            blockers: item.blockers || '',
            comments: item.comments || ''
          };
        });

        setStandups(formattedStandups);
        setError(null);
      } catch (err) {
        setError('Failed to load standups');
        console.error('Error loading standups:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadStandups();
    }
  }, [user]);

  // Load standup stats
  useEffect(() => {
    const loadStandupStats = async () => {
      try {
        const { data: statsData, error: statsError } = await supabase
          .from('standup_stats')
          .select('user_id, total_standups');

        if (statsError) {
          console.error('Error fetching standup stats:', statsError);
          return;
        }

        setStandupStats(statsData || []);
      } catch (err) {
        console.error('Error in loadStandupStats:', err);
      }
    };

    loadStandupStats();
  }, []);

  const users = useMemo(() => {
    const uniqueUsers = new Map();
    standups.forEach(standup => {
      uniqueUsers.set(standup.userId, {
        id: standup.userId,
        name: standup.userName,
      });
    });
    return Array.from(uniqueUsers.values());
  }, [standups]);

  const userProfileMap = useMemo(() => {
    return new Map(
      users.map(user => [
        user.id,
        { name: user.name || 'Anonymous', email: user.email || '' }
      ])
    );
  }, [users]);

  // Filter standups based on search query, user filter, and date range
  const filteredStandups = useMemo(() => {
    return standups
      .filter(standup => {
        const matchesSearch = 
          searchQuery === '' ||
          standup.yesterday.toLowerCase().includes(searchQuery.toLowerCase()) ||
          standup.today.toLowerCase().includes(searchQuery.toLowerCase()) ||
          standup.blockers.toLowerCase().includes(searchQuery.toLowerCase()) ||
          standup.comments.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesUser = userFilter === '' || standup.userId === userFilter;

        const matchesDateRange = 
          (!dateRange.startDate || new Date(standup.date) >= new Date(dateRange.startDate)) &&
          (!dateRange.endDate || new Date(standup.date) <= new Date(dateRange.endDate));

        return matchesSearch && matchesUser && matchesDateRange;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [standups, searchQuery, userFilter, dateRange]);

  const handleNewStandup = async (data: { yesterday: string; today: string; blockers: string; comments: string }) => {
    try {
      const { data: insertedData, error: insertError } = await supabase
        .from('standups')
        .insert([{
          user_id: user?.id,
          yesterday: data.yesterday,
          today: data.today,
          blockers: data.blockers,
          comments: data.comments
        }])
        .select(`
          id,
          yesterday,
          today,
          blockers,
          comments,
          created_at,
          user_id
        `)
        .single();

      if (insertError) throw insertError;

      const newStandup: Standup = {
        id: insertedData.id,
        date: new Date(insertedData.created_at),
        userId: insertedData.user_id,
        userName: user?.user_metadata.name || user.email?.split('@')[0] || 'Anonymous',
        yesterday: insertedData.yesterday,
        today: insertedData.today,
        blockers: insertedData.blockers || '',
        comments: insertedData.comments || ''
      };

      setStandups(prev => [newStandup, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to create standup');
      console.error('Error creating standup:', err);
    }
    setIsNewModalOpen(false);
  };

  const handleEditStandup = async (updatedStandup: Standup) => {
    try {
      const { error: updateError } = await supabase
        .from('standups')
        .update({
          yesterday: updatedStandup.yesterday,
          today: updatedStandup.today,
          blockers: updatedStandup.blockers,
          comments: updatedStandup.comments
        })
        .eq('id', updatedStandup.id)
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      setStandups(prev =>
        prev.map(standup =>
          standup.id === updatedStandup.id ? updatedStandup : standup
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update standup');
      console.error('Error updating standup:', err);
    }
    setEditingStandup(null);
  };

  const handleDeleteStandup = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('standups')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (deleteError) throw deleteError;

      setStandups(prev => prev.filter(standup => standup.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete standup');
      console.error('Error deleting standup:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to access the dashboard
          </h1>
        </div>
      </div>
    );
  }

  const patterns = {
    light: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.8'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    dark: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  };

  return (
    <div 
      className="min-h-screen bg-gray-200 dark:bg-gray-900"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(30, 41, 59, 0.05), rgba(30, 41, 59, 0.05)), ${theme === 'dark' ? patterns.dark : patterns.light}`,
        backgroundSize: '60px 60px'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Standups</h1>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>

          {/* Stats Section */}
          <div className="w-full">
            <StatsCards standupStats={standupStats} users={users} />
          </div>

          {/* Filters and New Standup Button Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <StandupFilter
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  userFilter={userFilter}
                  onUserFilterChange={setUserFilter}
                  dateRange={dateRange}
                  onDateRangeChange={(startDate, endDate) => setDateRange({ startDate, endDate })}
                  users={users}
                />
              </div>
              <div className="w-full sm:w-auto shrink-0">
                <Button
                  onClick={() => setIsNewModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                  variant="primary"
                >
                  <Plus className="w-5 h-5" />
                  New Standup
                </Button>
              </div>
            </div>
          </div>

          {/* Standups Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8 text-red-500">{error}</div>
            ) : filteredStandups.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                No standups found
              </div>
            ) : (
              filteredStandups.map((standup) => (
                <StandupCard
                  key={standup.id}
                  standup={standup}
                  onEdit={() => setEditingStandup(standup)}
                  onDelete={handleDeleteStandup}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="New Daily Standup Tracker Entry"
      >
        <NewStandupForm
          onSubmit={handleNewStandup}
          onCancel={() => setIsNewModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingStandup}
        onClose={() => setEditingStandup(null)}
        title="Edit Daily Standup Tracker Entry"
      >
        {editingStandup && (
          <EditStandupForm
            standup={editingStandup}
            onSubmit={handleEditStandup}
            onCancel={() => setEditingStandup(null)}
          />
        )}
      </Modal>
    </div>
  );
};