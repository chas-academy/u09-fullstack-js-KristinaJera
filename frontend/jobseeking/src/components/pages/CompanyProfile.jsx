import { useState, useEffect } from 'react';
import axios from 'axios'; 
import { FaEdit } from 'react-icons/fa'; 

const CompanyProfile = () => {
    // State to manage the form data
    const [formData, setFormData] = useState({
        companyName: '',
        about: '',
        email: '',
        contact: '',
        location: '',
        profileUrl: '', 
    });

    const [profileImage, setProfileImage] = useState(null); // Profile image state
    const [successMessage, setSuccessMessage] = useState(false); // Success message state
    const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes

    useEffect(() => {
        // Fetch company data from the backend
        const fetchCompanyData = async () => {
            const token = localStorage.getItem("authToken"); 
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await axios.post(
                    'http://localhost:3000/api/get-company-profile',
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
                    companyName: data.companyName,
                    about: data.about,
                    email: data.email,
                    contact: data.contact,
                    location: data.location,
                    profileUrl: profileImage,
                });
                setProfileImage(profileImage); 
            } catch (error) {
                console.error("Error fetching company profile:", error);
            }
        };

        fetchCompanyData();
    }, []);

    // Handle input changes for the form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle profile image change and preview
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            setFormData((prevData) => ({
                ...prevData,
                profileUrl: file, 
            }));
        }
    };

    // Handle form submission to update profile
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        const updatedData = {
            ...formData,
            userId: localStorage.getItem("userId"),
        };

        try {
            if (profileImage && typeof formData.profileUrl !== 'string') {
                const imageFormData = new FormData();
                imageFormData.append('profileImage', formData.profileUrl);
                
                const uploadResponse = await axios.post('http://localhost:3000/api/upload-profile-image', imageFormData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                updatedData.profileUrl = uploadResponse.data.url;
            }

            await axios.put('http://localhost:3000/api/update-company-profile', updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccessMessage(true);
            setTimeout(() => {
                setSuccessMessage(false);
            }, 3000);
            setIsEditing(false); // Return to view mode after update
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    // Toggle to edit mode
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
                        <p className="text-lg font-medium mt-3">{formData.companyName || 'Your Company'}</p>
                        <p className="text-sm text-gray-500">{formData.about || 'About Your Company'}</p>
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
                    {/* Edit Mode: Display Profile Update Form */}
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
                        
                        {/* Form Fields */}
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
                            <textarea
                                id="about"
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                </>
            )}

            {successMessage && (
                <div className="mt-4 text-center text-green-500 font-semibold">
                    Profile Updated Successfully!
                </div>
            )}
        </div>
    );
};

export default CompanyProfile;
