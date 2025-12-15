import { FaUsers, FaPlus } from 'react-icons/fa';
import { Button } from '../../components/forms';

const Users = () => {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark">Users Management</h1>
            <p className="text-gray-600 mt-1">Manage system users</p>
          </div>
          <Button variant="primary" icon={FaPlus}>
            Add New User
          </Button>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl shadow-md p-12">
          <div className="text-center">
            <FaUsers className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-500">
              Users management page is under development
            </p>
          </div>
        </div>
      </div>  );
};

export default Users;
