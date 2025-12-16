import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common';
import { Button, Input, Select } from '../../components/forms';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaUserShield, FaUserTie, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getAllUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../../services/userService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const Users = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Get current page from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page = 1, isInitialLoad = false) => {
    try {
      // Only show full loading on initial load
      if (users.length === 0 || isInitialLoad) {
        setLoading(true);
      } else {
        setPaginationLoading(true);
      }

      const response = await getAllUsers(page, pagination.perPage);
      setUsers(response.data?.users || []);
      setPagination(response.data?.pagination || { page: 1, perPage: 10, total: 0 });
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (selectedUser) {
        await updateUser(selectedUser._id, formData);
        showSuccessToast('User updated successfully!');
      } else {
        await createUser(formData);
        showSuccessToast('User created successfully!');
      }
      setIsModalOpen(false);
      fetchUsers(currentPage, true);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete._id);
      showSuccessToast('User deleted successfully!');
      setIsConfirmOpen(false);
      setUserToDelete(null);
      fetchUsers(currentPage, true);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await toggleUserStatus(user._id);
      showSuccessToast(`User ${user.isActive ? 'deactivated' : 'activated'} successfully!`);
      fetchUsers(currentPage, true);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return FaUserShield;
      case 'driver':
        return FaUserTie;
      default:
        return FaUsers;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'driver':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Users Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and permissions</p>
        </div>
        <Button
          variant="primary"
          icon={FaPlus}
          onClick={handleCreate}
        >
          Add New User
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-4">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No users found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first user</p>
            <Button variant="primary" icon={FaPlus} onClick={handleCreate}>
              Add New User
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            {/* Loading overlay for pagination */}
            {paginationLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <LoadingSpinner size="lg" />
              </div>
            )}

            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    License / CIN
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getRoleBadge(user.role)}`}>
                            <RoleIcon className="text-lg" />
                          </div>
                          <div>
                            <div className="font-medium text-dark">{user.fullname}</div>
                            <div className="text-xs text-gray-500">
                              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-700">{user.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role === 'driver' ? (
                          <div className="text-sm">
                            <div className="text-gray-700">{user.licenseNumber || 'N/A'}</div>
                            <div className="text-gray-500 text-xs">{user.cin || 'N/A'}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {user.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${user.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                        >
                          {user.isActive ? (
                            <>
                              <FaCheckCircle />
                              Active
                            </>
                          ) : (
                            <>
                              <FaTimesCircle />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {users.length > 0 && pagination.total > pagination.perPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(pagination.total / pagination.perPage)}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Add New User'}
        size="lg"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.fullname}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

// User Form Component
const UserForm = ({ user, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'driver',
    licenseNumber: user?.licenseNumber || '',
    cin: user?.cin || '',
    phone: user?.phone || '',
    isActive: user?.isActive !== undefined ? user.isActive : true
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.fullname) newErrors.fullname = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!user && !formData.password) newErrors.password = 'Password is required';
    if (formData.role === 'driver') {
      if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required for drivers';
      if (!formData.cin) newErrors.cin = 'CIN is required for drivers';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Don't send password if it's empty (for updates)
    const submitData = { ...formData };
    if (user && !submitData.password) {
      delete submitData.password;
    }

    onSubmit(submitData);
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'driver', label: 'Driver' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <Input
          label="Full Name"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          placeholder="John Doe"
          required
          error={errors.fullname}
        />

        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
          error={errors.email}
        />

        {/* Password */}
        <Input
          label={user ? 'Password (leave empty to keep current)' : 'Password'}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required={!user}
          error={errors.password}
        />

        {/* Role */}
        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roleOptions}
          required
        />

        {/* Driver-specific fields */}
        {formData.role === 'driver' && (
          <>
            <Input
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="DL-MA-001234"
              required
              error={errors.licenseNumber}
            />

            <Input
              label="CIN"
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              placeholder="AB123456"
              required
              error={errors.cin}
            />

            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+212612345678"
            />
          </>
        )}

        {/* Active Status */}
        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
            Active User
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default Users;
