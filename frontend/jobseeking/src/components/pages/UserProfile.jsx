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
                    'https://u09-fullstack-js-kristinajera.onrender.com/api/get-user-profile',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = response.data.data;
                const profileImage = data.profileUrl ? `https://u09-fullstack-js-kristinajera.onrender.com${data.profileUrl}` : null;

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
            userId: localStorage.getItem('userId'), 
        };

        try {
            // If profile image was changed, handle image upload
            if (profileImage && typeof formData.profileUrl !== 'string') {
                const imageFormData = new FormData();
                imageFormData.append('profileImage', formData.profileUrl);

                const uploadResponse = await axios.post('https://u09-fullstack-js-kristinajera.onrender.com/api/upload-profile-image', imageFormData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                updatedData.profileUrl = uploadResponse.data.url; // Update profile URL
            }

            // Update user profile
            await axios.put('https://u09-fullstack-js-kristinajera.onrender.com/api/update-user-profile', updatedData, {
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
        <div className="container mx-auto lg:w-3/5 w-full px-4 py-10">
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-200 to-purple-200 shadow-lg rounded-lg p-6">
                {!isEditing ? (
                    <>
                        {/* View Mode: Display Profile Information */}
                        <div className="flex flex-col items-center mb-6 pt-5 transition-transform transform hover:scale-105 duration-300">
                            <img
                                src={profileImage || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white"
                            />
                            <p className="text-2xl font-medium mt-4 text-gray-900">{formData.firstName} {formData.lastName}</p>
                            <p className="text-base text-gray-700 mt-2">About: {formData.about || 'Write something about yourself'}</p>
                            <p className="text-sm text-gray-500 mt-1">Email: {formData.email}</p>
                            <p className="text-sm text-gray-500 mt-1">Contact: {formData.contact}</p>
                            <p className="text-sm text-gray-500 mt-1">Location: {formData.location}</p>
                            <button
                                onClick={handleEditClick}
                                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
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
                                <div className="relative p-5">
                                    <img
                                        src={profileImage || 'https://via.placeholder.com/150'}
                                        alt="Profile"
                                        className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white"
                                    />
                                    <label
                                        htmlFor="profileImage"
                                        className="absolute bottom-8 right-5 p-2 bg-gray-800 text-white rounded-full cursor-pointer"
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
                                    className=" mt-1 block w-full bg-gradient-to-r from-blue-100 to-purple-100 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 "
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
                                    className="mt-1 bg-gradient-to-r from-blue-100 to-purple-100 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                    className="mt-1 bg-gradient-to-r from-blue-100 to-purple-100 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                    className="mt-1 bg-gradient-to-r from-blue-100 to-purple-100 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                    className="mt-1 bg-gradient-to-r from-blue-100 to-purple-100 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white
                                    rounded-md  shadow-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Save Changes
                                </button>
                            </div>

                            {/* Cancel Button */}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="w-full mt-2 px-4 py-2 bg-gray-600 text-white rounded-md shadow-lg hover:bg-gray-700 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mt-4 text-center text-green-600 font-semibold">
                        Profile updated successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
