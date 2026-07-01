import React from 'react';
import RolesHeader from '../components/RolesHeader';
import RoleCard from '../components/RoleCard';

const RolesPage = () => {
  const roles = [
    {
      name: 'Super Admin',
      description: 'Full system access, can manage settings, employee records, roles, and financial details.',
      membersCount: 2,
      permissions: ['view_employees', 'manage_employees', 'view_bank_accounts', 'view_holidays', 'view_attendance', 'view_roles'],
    },
    {
      name: 'HR Manager',
      description: 'Can manage employees, view attendances, manage holidays list, and assign regular roles.',
      membersCount: 5,
      permissions: ['view_employees', 'manage_employees', 'view_holidays', 'view_attendance'],
    },
    {
      name: 'Software Engineer',
      description: 'Standard employee permissions to view own attendance logs, view holidays, and link bank accounts.',
      membersCount: 24,
      permissions: ['view_holidays', 'view_attendance', 'view_bank_accounts'],
    },
  ];

  const handleCreateRole = () => {
    console.log('Create New Role clicked');
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <RolesHeader onCreateClick={handleCreateRole} />

      {/* Role list representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((r, i) => (
          <RoleCard key={i} role={r} />
        ))}
      </div>
    </div>
  );
};

export default RolesPage;
