import React from 'react';
import { useQuery } from '@tanstack/react-query';
import RolesHeader from '../components/RolesHeader';
import RoleCard from '../components/RoleCard';
import api, { ROLE_ENDPOINTS } from '../../../services/api';

const RolesPage = () => {
  const { data: roles = [], isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await api.get(ROLE_ENDPOINTS.GET_ALL);
      return response.data?.data?.roles || [];
    },
  });

  const handleCreateRole = () => {
    console.log('Create New Role clicked');
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <RolesHeader onCreateClick={handleCreateRole} />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-rose-50 rounded-2xl border border-rose-100 p-6">
          <p className="text-rose-600 font-medium">Failed to load roles. Please try again later.</p>
        </div>
      ) : (
        /* Role list representation */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r, i) => (
            <RoleCard key={i} role={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RolesPage;
