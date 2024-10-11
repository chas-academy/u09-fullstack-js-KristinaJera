import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';

const UserProfile = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        location: '',
        about: '',
        profileUrl: '',
    });

    const [profileImage, setProfileImage] = useState(null); // For handling profile image state
    const [successMessage, setSuccessMessage] = useState(false); // To show success messages
    const [isEditing, setIsEditing] = useState(false); // Toggle between edit and view modes

    useEffect(() => {
        // Fetch user data from backend when component mounts
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await axios.post(
                    'http://localhost:3000/api/get-user-profile',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = response.data.data;
                const profileImage = data.profileUrl ? `http://localhost:3000${data.profileUrl}` : null;

                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    contact: data.contact,
                    location: data.location,
                    about: data.about,
                    profileUrl: profileImage,
                });

                setProfileImage(profileImage);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserData();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle profile image change
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            setFormData((prevData) => ({
                ...prevData,
                profileUrl: file, // Set the image file to be uploaded
            }));
        }
    };

    // Submit updated profile data
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        const updatedData = {
            ...formData,
            userId: localStorage.getItem('userId'), // assuming you store userId in localStorage
        };

        try {
            // If profile image was changed, handle image upload
            if (profileImage && typeof formData.profileUrl !== 'string') {
                const imageFormData = new FormData();
                imageFormData.append('profileImage', formData.profileUrl);

                const uploadResponse = await axios.post('http://localhost:3000/api/upload-profile-image', imageFormData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                updatedData.profileUrl = uploadResponse.data.url; // Update profile URL
            }

            // Update user profile
            await axios.put('http://localhost:3000/api/update-user-profile', updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccessMessage(true);
            setTimeout(() => {
                setSuccessMessage(false);
            }, 3000);
            setIsEditing(false); // Switch back to view mode
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    // Toggle edit mode
    const handleEditClick = () => setIsEditing(true);

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
            {!isEditing ? (
                <>
                    {/* View Mode: Display Profile Information */}
                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={profileImage || 'https://via.placeholder.com/150'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <p className="text-lg font-medium mt-3">{formData.firstName} {formData.lastName}</p>
                        <p className="text-sm text-gray-500">{formData.about || 'About You'}</p>
                        <p className="text-sm text-gray-500">Email: {formData.email}</p>
                        <p className="text-sm text-gray-500">Contact: {formData.contact}</p>
                        <p className="text-sm text-gray-500">Location: {formData.location}</p>
                        <button
                            onClick={handleEditClick}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
                        >
                            Edit Profile
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {/* Edit Mode: Form to Edit Profile */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <img
                                    src={profileImage || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                                <label
                                    htmlFor="profileImage"
                                    className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full cursor-pointer"
                                    title="Edit Profile Picture"
                                >
                                    <FaEdit />
                                </label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    className="hidden"
                                    onChange={handleProfileImageChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        {/* About */}
                        <div>
                            <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
                            <textarea
                                id="about"
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Contact */}
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border                                 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
                            >
                                Save Changes
                            </button>
                        </div>

                        {/* Success Message */}
                        {successMessage && (
                            <div className="mt-4 text-green-600 font-medium">
                                Profile updated successfully!
                            </div>
                        )}
                    </form>
                </>
            )}
        </div>
    );
};

export default UserProfile;

