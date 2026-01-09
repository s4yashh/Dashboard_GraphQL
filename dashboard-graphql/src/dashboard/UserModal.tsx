import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { User } from '../types/user';
import { CREATE_USER, UPDATE_USER, GET_USERS } from './dashboard.graphql';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [error, setError] = useState('');

  const [createUser, { loading: createLoading }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
      });
    } else {
      setFormData({ name: '', email: '', role: '' });
    }
    setError('');
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (user) {
        await updateUser({
          variables: {
            id: user.id,
            ...formData,
          },
        });
      } else {
        await createUser({
          variables: formData,
        });
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">
          {user ? 'Edit User' : 'Add New User'}
        </h2>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />

          <div className="flex gap-2 justify-end mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={createLoading || updateLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createLoading || updateLoading}
            >
              {user ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
