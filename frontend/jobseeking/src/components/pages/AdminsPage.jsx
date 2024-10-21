import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmationModal from "../ConfirmationModal"; // Ensure this is the correct path
import Modal from "react-modal";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [isUpdateConfirmationModalOpen, setIsUpdateConfirmationModalOpen] = useState(false);
  const [isCreateConfirmationModalOpen, setIsCreateConfirmationModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", 
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get("https://u09-fullstack-js-kristinajera.onrender.com/api/admin/admins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Something went wrong");
      }
    };

    fetchAdmins();
  }, []);

  const handleSubmit = (e, actionType) => {
    e.preventDefault();
    
    // Perform validation
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
  
    setPasswordError('');

    if (actionType === "create") {
    handleOpenCreateConfirmationModal();
    } else if (actionType === "update") {
      handleUpdateAdmin();
    }
  };

  const handleOpenModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData(admin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null);
    setFormData({
     username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
  };

  const handleOpenDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteConfirmationModalOpen(true);
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) {
      console.error("No admin selected for deletion");
      return;
    }

    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`https://u09-fullstack-js-kristinajera.onrender.com/api/admin/admins/${selectedAdmin._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(admins.filter((admin) => admin._id !== selectedAdmin._id));
      setIsDeleteConfirmationModalOpen(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error("Failed to delete admin", error);
    }
  };

  const handleUpdateAdmin = () => {
    setIsUpdateConfirmationModalOpen(true);
  };

  const handleSubmitUpdate = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.put(
        `https://u09-fullstack-js-kristinajera.onrender.com/api/admin/admins/${selectedAdmin._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === response.data._id ? response.data : admin
        )
      );
      setIsUpdateConfirmationModalOpen(false);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update admin", error);
    }
  };

  const handleOpenCreateModal = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
    setIsCreateModalOpen(true);
  };

   // Function to close the create company modal
   const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setIsCreateConfirmationModalOpen(false);
  };

  const handleOpenCreateConfirmationModal = () => {
    setIsCreateConfirmationModalOpen(true);
  };
  const handleSubmitCreate = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        "https://u09-fullstack-js-kristinajera.onrender.com/api/admin/create-admin",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmins((prevAdmins) => [...prevAdmins, response.data]);
      handleCloseCreateModal();
    } catch (error) {
      console.error("Failed to create admin:", 
        error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message : "Error occurred during admin creation");
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-6 mx-auto">
        <h1 className="text-3xl font-bold text-indigo-600 text-center mb-6">
          Manage Application Admins
        </h1>
        <div className="flex lg:justify-end mb-10">
          <button
            onClick={handleOpenCreateModal}
            className="text-white bg-green-500 border-0 py-2 px-4 focus:outline-none hover:bg-green-600 rounded"
          >
            Create Admin
          </button>
        </div>

        {error && <p className="text-center py-4 text-red-500">{error}</p>}
        {!error && admins.length === 0 && (
          <p className="text-center py-4">No admins found.</p>
        )}
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-full py-2 align-middle">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                      <tr key={admin._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {admin.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {admin.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {admin.role || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenModal(admin)}
                            className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded mr-2"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(admin)}
                            className="text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile View */}
                <div className="block md:hidden">
                  {admins.map((admin) => (
                    <div
                      key={admin._id}
                      className="border border-gray-200 mb-4 p-4 rounded"
                    >
                      <h2 className="font-bold">{admin.username}</h2>
                      <p>
                        <strong>Email:</strong> {admin.email}
                      </p>
                      <p>
                        <strong>Role:</strong> {admin.role || "N/A"}
                      </p>
                      <div className="flex justify-end mt-2">
                        <button 
                          onClick={() => handleOpenModal(admin)}
                          className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-3 rounded mr-2"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(admin)}
                          className="text-white bg-red-500 hover:bg-red-600 py-1 px-3 rounded"
                        >
                        Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>


         {/* Delete Confirmation Modal */}
         <ConfirmationModal
        isOpen={isDeleteConfirmationModalOpen}
        onRequestClose={() => setIsDeleteConfirmationModalOpen(false)}
        onConfirm={handleDeleteAdmin}
        jobTitle={
          selectedAdmin?.username
            ? `${selectedAdmin.username} ${selectedAdmin.username}`
            : "Admin"
        }
        message={`Are you sure you want to delete ${selectedAdmin?.username}?`}
         actionType="delete"
      />

      {/* Create Admin Modal */}
<Modal
  isOpen={isCreateModalOpen}
  onRequestClose={handleCloseCreateModal}
  contentLabel="Create Admin"
  className="flex items-center justify-center fixed inset-0 z-50 outline-none mt-16"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50"
>
  <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg lg:max-w-2xl w-full transform transition-all duration-300">
    <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-4 text-indigo-700">
      Create Admin
    </h2>
    <form onSubmit={(e) => handleSubmit(e, "create")}>
      {/* Form fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        <div>
          <label className="block text-gray-700">Admin Name</label>
          <input
            type="text"
            value={formData.username || ""} 
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
            required
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-gray-700">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="mt-1 w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
            required
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-5">
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(false)}
          className="mr-2 text-indigo-700 bg-gray-300 border-0 py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded"
        >
          Create
        </button>
      </div>
    </form>
  </div>
</Modal>
           {/* Create Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCreateConfirmationModalOpen}
        onRequestClose={() => setIsCreateConfirmationModalOpen(false)}
        onConfirm={handleSubmitCreate}
        message={`Are you sure you want to create ${formData.username}?`}
      />

     {/* Update Admin Modal */}
<Modal
  isOpen={isModalOpen}
  onRequestClose={handleCloseModal}
  contentLabel="Update Admin"
  className="flex items-center justify-center fixed inset-0 z-50 outline-none mt-16"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50"
>
  <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg lg:max-w-2xl w-full transform transition-all duration-300">
    <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-4 text-indigo-600">
      Update Admin
    </h2>
    <form onSubmit={(e) => handleSubmit(e, "update")}>
      {/* Responsive Grid Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        <div>
          <label className="block text-gray-700">Admin Name</label>
          <input
            type="text"
            value={formData.username || ""}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
          />
          {/* Show password error */}
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-gray-700">Role</label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="mt-1 w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
            required
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-5 lg:col-span-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="mr-2 text-indigo-500 bg-gray-300 border-0 py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded"
        >
          Update
        </button>
      </div>
    </form>
  </div>
</Modal>
        {/* Update Confirmation Modal */}
        <ConfirmationModal
           isOpen={isUpdateConfirmationModalOpen}
           onRequestClose={() => setIsUpdateConfirmationModalOpen(false)}
           onConfirm={handleSubmitUpdate}
           jobTitle={formData.username || "Admin"}
           actionType="update"
         />
      </div>
    </section>
  );
};

export default AdminsPage;
