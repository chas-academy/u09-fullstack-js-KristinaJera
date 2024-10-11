import mongoose from "mongoose";
import Users from "../models/userModel.js";

export const updateUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    contact,
    location,
    profileUrl,
    jobTitle,
    about,
  } = req.body;
    
  try {
    if(!firstName || !lastName || !email || !contact || !jobTitle || !about){
        next("Please provide all required fields");
    }
    
    const id = req.body.user.userId;
    if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).send(`No User with id:${id}`);
    }
    
    const updateUser = {
        firstName,
        lastName,
        email,
        contact,
        location,
        profileUrl,
        jobTitle,
        about,
        _id: id,
    };
    
    const user = await Users.findByIdAndUpdate(id, updateUser,{new:true} );
    
    const token = user.createJWT()
    
    user.password = undefined;
    
    res.status(200).json({
        success:true,
        message: "User Updated Successfully",
        user,
        token,
    });
    
    } catch{
    console.log(error);
    res.status(404).json({ message: error.message });
    
    }
};

export const getUser = async (req, res, next) => {

    try{

        const id = req.body.user.userId;

        const user = await Users.findById({_id: id});

        if(!user){
            return res.status(200).send({
                message: "User Not Found",
                success:false, 
            });
        }
      user.password = undefined;

      res.status(200).send({
        success:true,
        user: user,
      });


    } catch (error){
    console.log(error);
    res.status(500).send({
        message: "auth error",
        success: false,
        error: error.message,
    })
    }
};

export const getUserProfile = async (req, res) => {
  try {
      const userId = req.user.userId; // User ID from the token
      const user = await Users.findById(userId).select('-password');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      // Make sure profileUrl is included in the user document
      res.status(200).json({ message: 'User profile fetched successfully', data: user });
  } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};


// Update User Profile Controller
export const updateUserProfile = async (req, res) => {
  try {
      const userId = req.user.userId; // Extract user ID from authenticated request
      const { firstName, lastName, email, contact, location, jobTitle, about, profileUrl } = req.body;

      // Find the user and update their profile
      const user = await Users.findByIdAndUpdate(
          userId,
          {
              firstName,
              lastName,
              email,
              contact,
              location,
              jobTitle,
              about,
              profileUrl,
          },
          { new: true, runValidators: true } // Return the updated document and run validators
      );

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Return the updated user data
      res.status(200).json({ message: 'Profile updated successfully', data: user });
  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};