import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmationModal from "../ConfirmationModal";
import Modal from "react-modal";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateConfirmationModalOpen, setIsUpdateConfirmationModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: '',
    email: "",
    contact: "",
    location: "",
    role: "",
  });
  const [passwordError, setPasswordError] = useState('');
  const [isCreateConfirmationModalOpen, setIsCreateConfirmationModalOpen] =
    useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);

    useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          "https://u09-fullstack-js-kristinajera.onrender.com/api/admin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Something went wrong");
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = (e, actionType) => {
    e.preventDefault(); // Prevent the form's default submission behavior
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return; // Stop form submission if passwords don't match
    }
  
    // If passwords match, clear the error
    setPasswordError('');
  
    // Decide between "create" and "update" logic based on the actionType
    if (actionType === "create") {
      // Proceed with the logic for creating a new user
      handleOpenCreateConfirmationModal(); // Open the create confirmation modal
    } else if (actionType === "update") {
      // Proceed with the logic for updating an existing user
      handleUpdateUser(); // Call the function to update the user
    }
  };
  

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      location: "",
      role: "",
      password: "",
      confirmPassword: '',
    });
  };

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteConfirmationModalOpen(true);
  };
  const handleDeleteUser = async () => {
    if (!selectedUser) {
      console.error("No user selected for deletion");
      return;
    }

    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(
        `https://u09-fullstack-js-kristinajera.onrender.com/api/admin/users/${selectedUser._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setIsDeleteConfirmationModalOpen(false); // Close the confirmation modal
      setSelectedUser(null); // Clear selected user
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleUpdateUser = () => {
    setIsUpdateConfirmationModalOpen(true); // Open update confirmation modal
  };

  const handleSubmitUpdate = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.put(
        `https://u09-fullstack-js-kristinajera.onrender.com/api/admin/users/${selectedUser._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === response.data._id ? response.data : user
        )
      );
      setIsUpdateConfirmationModalOpen(false);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  // Function to open the create user modal
  const handleOpenCreateModal = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      location: "",
      role: "",
      password: "",
      confirmPassword: '',
    });
    setIsCreateModalOpen(true);
  };
  // Function to close the create user modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setIsCreateConfirmationModalOpen(false); // Close confirmation modal if open
  };

  const handleOpenCreateConfirmationModal = () => {
    setIsCreateConfirmationModalOpen(true);
  };

  const handleSubmitCreate = async () => {
    const token = localStorage.getItem("authToken");
    console.log("Submitting data:", formData);
    try {
      const response = await axios.post(
        "https://u09-fullstack-js-kristinajera.onrender.com/api/admin/create-user",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ); 
      setUsers((prevUsers) => [...prevUsers, response.data]);
      handleCloseCreateModal();
    } catch (error) {
      console.error(
        "Failed to create user:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response
          ? error.response.data.message
          : "Error occurred during user creation"
      );
    }
   };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-6 mx-auto">
        <h1 className="text-3xl font-bold text-indigo-600 text-center mb-6">
          Manage Application Users
        </h1>
        <div className="flex lg:justify-end mb-10">
          <button
            onClick={handleOpenCreateModal}
            className="text-white bg-green-500 border-0 py-2 px-4 focus:outline-none hover:bg-green-600 rounded"
          >
            Create User
          </button>
        </div>

        {error && <p className="text-center py-4 text-red-500">{error}</p>}
        {!error && users.length === 0 && (
          <p className="text-center py-4">No users found.</p>
        )}
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-full py-2 align-middle">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        First Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
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
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.firstName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.contact || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.location || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded mr-2"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(user)}
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
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="border border-gray-200 mb-4 p-4 rounded"
                    >
                      <h2 className="font-bold">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Contact:</strong> {user.contact || "N/A"}
                      </p>
                      <p>
                        <strong>Location:</strong> {user.location || "N/A"}
                      </p>
                      <p>
                        <strong>Role:</strong> {user.role}
                      </p>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded mr-2"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
                          className="text-white bg-red-500 hover:bg-red-600 py-1 px-2 rounded"
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

        <ConfirmationModal
          isOpen={isDeleteConfirmationModalOpen}
          onRequestClose={() => setIsDeleteConfirmationModalOpen(false)}
          jobTitle={
            selectedUser?.firstName
              ? `${selectedUser.firstName} ${selectedUser.lastName}`
              : "User"
          }
          onConfirm={handleDeleteUser}
          actionType="delete"
        />

        {/* Update User Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Update User"
          className="flex items-center justify-center fixed inset-0 z-50 outline-none mt-16"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg lg:max-w-2xl w-full transform transition-all duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-4 text-indigo-600">
              Update User
            </h2>
            <form
  onSubmit={(e) => handleSubmit(e, "update")} // Pass the actionType "update"
>
              {/* Responsive Grid Form Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                <div>
                  <label className="block text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
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
                    required
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
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
            required
          />
          {/* Show password error */}
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
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
                  <label className="block text-gray-700">Contact</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
                    required
                  />
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
                    <option value="user">User</option>
                    {/* Add more options if necessary */}
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
          user={selectedUser}
          actionType="update"
        />

        {/* Create User Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onRequestClose={handleCloseCreateModal}
          contentLabel="Create User"
          className="flex items-center justify-center fixed inset-0 z-50 outline-none mt-16"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg lg:max-w-2xl w-full transform transition-all duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-4 text-indigo-700">
              Create User
            </h2>
            <form
  onSubmit={(e) => handleSubmit(e, "create")} // Pass the actionType "create"
>
              {/* Form fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                <div>
                  <label className="block text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
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
                    className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
                    required
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
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
            required
          />
          {/* Show password error */}
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Contact</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-gray-700">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="mt-1 w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-700 transition-colors"
                    required
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    <option value="user">User</option>
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
          user={formData}
          actionType="create"
        />
      </div>
    </section>
  );
};

export default UsersPage;


