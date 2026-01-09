import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS } from './dashboard.graphql';
import { User } from '../types/user';
import { Loader } from '../components/Loader';
import { Button } from '../components/Button';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';

export const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data, loading, error, refetch } = useQuery(GET_USERS);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSave = () => {
    refetch();
    handleModalClose();
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <Button onClick={handleAdd} variant="primary">
            Add User
          </Button>
        </div>

        <UserTable users={data?.users || []} onEdit={handleEdit} onRefetch={refetch} />

        {isModalOpen && (
          <UserModal
            user={selectedUser}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};
