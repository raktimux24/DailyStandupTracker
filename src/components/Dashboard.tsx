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
import { patterns } from '../styles/patterns';
import { useTheme } from '../contexts/ThemeContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Dashboard: React.FC = () => {
  useDocumentTitle('Daily Standup Tracker');
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingStandup, setEditingStandup] = useState<Standup | null>(null);
  const [standups, setStandups] = useState<Standup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const filteredStandups = useMemo(() => {
    return standups
      .filter(standup => {
        const matchesSearch = searchQuery === '' || 
          standup.yesterday.toLowerCase().includes(searchQuery.toLowerCase()) ||
          standup.today.toLowerCase().includes(searchQuery.toLowerCase()) ||
          standup.blockers?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          standup.comments?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesUser = userFilter === '' || standup.userId === userFilter;
        
        return matchesSearch && matchesUser;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [searchQuery, userFilter, standups]);

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

  const backgroundPattern = theme === 'dark' ? patterns.dashboardDark : patterns.dashboard;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={backgroundPattern}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 shadow backdrop-blur-sm" style={backgroundPattern}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <ClipboardList className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Standup Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <StandupFilter
            onSearchChange={setSearchQuery}
            onUserFilterChange={setUserFilter}
            searchQuery={searchQuery}
            userFilter={userFilter}
            users={users}
          />
          
          <Button onClick={() => setIsNewModalOpen(true)} className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            New Standup
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/50">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading standups...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStandups.map(standup => (
                <StandupCard
                  key={standup.id}
                  standup={standup}
                  onEdit={setEditingStandup}
                  onDelete={handleDeleteStandup}
                />
              ))}
            </div>

            {filteredStandups.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No standups found matching your criteria.</p>
              </div>
            )}
          </>
        )}

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
    </div>
  );
};