import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModel.js";
import Applications from "../models/applicationsModel.js";

export const register = async (req, res, next) => {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name) {
        return next("Company Name is required!");
    }

    if (!email) {
        return next("Email address is required!");
    }

    if (!password) {
        return next("Password is required and must be greater than 6 characters!");
    }

    try {
        const accountExist = await Companies.findOne({ email });

        if (accountExist) {
            return next("Email Already Registered, Please Login");
        }

        // Create a new account
        const company = await Companies.create({
            name,
            email,
            password,
            role: 'company' // Ensure role is set
        });

        // Generate JWT token
        const token = company.createJWT();

        res.status(201).json({
            success: true,
            message: "Company Account Created Successfully",
            user: {
                _id: company._id,
                name: company.name,
                email: company.email,
                role: company.role // Include role in response
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Validation
        if (!email || !password) {
            return next("Please Provide A User Credentials");
        }

        const company = await Companies.findOne({ email }).select("+password");

        if (!company) {
            return next("Invalid Email or Password");
        }

        // Compare password
        const isMatch = await company.comparePassword(password);
        if (!isMatch) {
            return next("Invalid Email or Password");
        }

        company.password = undefined;

        // Generate JWT token
        const token = company.createJWT();

        res.status(200).json({
            success: true,
            message: "Login Successfully",
            user: {
                _id: company._id,
                name: company.name,
                email: company.email,
                role: company.role // Include role in response
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

export const createJob = async (req, res) => {
    const { companyId } = req.params; // This should be the company ID from the route
    const { jobTitle, jobType, location, salary, vacancies, experiences, detail } = req.body;

    try {
        // Create a new job with the appropriate structure
        const newJob = new Jobs({
            jobTitle,
            jobType,
            location,
            salary,
            vacancies,
            experiences,
            detail: {
                desc: detail[0].desc, // Ensure it's a single object for detail
                requirements: detail[0].requirements
            },
            company: companyId, // Attach the company ID directly at the top level
            createdBy: req.user.userId // Attach the user ID from the token
        });

        // Save the job to the database
        await newJob.save();

        return res.status(201).json({
            success: true,
            message: 'Job created successfully',
            job: newJob,
        });
    } catch (error) {
        console.error('Error creating job:', error);
        return res.status(500).json({ message: 'An error occurred while creating the job' });
    }
};
export const updateCompanyProfile = async (req, res, next) => {
    try {
        const userId = req.body.userId; // Adjust this if needed

        const { companyName, email, contact, location, profileUrl, about } = req.body;

        const updatedCompany = await Companies.findByIdAndUpdate(
            userId,
            { companyName, email, contact, location, profileUrl, about },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedCompany) {
            return res.status(404).json({
                success: false,
                message: "Company Not Found",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedCompany,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const uploadCompanyProfileImage = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        // Construct the URL or path to the uploaded file
        const imageUrl = `/uploads/${req.file.filename}`; // The file will be accessible at this path

        // Send the image URL back to the client
        res.status(200).json({
            success: true,
            url: imageUrl, // This is the URL to the uploaded image
            message: "Image uploaded successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const uploadResume = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
  
    const filename = req.file.filename;
    
    // Assuming you want to update an existing application with the uploaded resume
    try {
      await Applications.findByIdAndUpdate(req.body.applicationId, { resume: filename });
      return res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        filename,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to save resume' });
    }
  };

export const getCompanyProfile = async (req, res, next) => {
    try {
        const id = req.user.userId; // Access userId from req.user

        console.log('Fetching profile for user ID:', id); // Debug log

        const company = await Companies.findById(id); // Use id directly

        if (!company) {
            return res.status(404).json({
                message: "Company Not Found",
                success: false,
            });
        }

        company.password = undefined; // Hide password
        res.status(200).json({
            success: true,
            data: company,
        });

    } catch (error) {
        console.error('Error in getCompanyProfile:', error); // Log the error
        res.status(500).json({ message: 'Server Error: ' + error.message }); // Return a more descriptive error
    }
};

//GET ALL COMMPANIES
export const getCompanies = async (req, res, next) => {
    
    try {
        const { search, sort, location} = req.query;

        //conditions for searching filters
        const queryObject = {};

        if(search){
            queryObject.name = {$regex: search, $options: "i"};
        }

        if(location){
            queryObject.location = {$regex: location, $options: "i"};
        }
        let queryResult = Companies.find(queryObject).select("-password");

        //SORTING LISTINGS
   if(sort === "Newest") {
    queryResult = queryResult.sort("-createAt");
   }
   if(sort === "Oldest") {
    queryResult = queryResult.sort("createAt");
   }
   if(sort === "A-Z") {
    queryResult = queryResult.sort("name");
   }
   if(sort === "Z-A") {
    queryResult = queryResult.sort("-name");
   }

   //PADINATION
   const page = Number(req.query.page) || 1;
   const limit = Number(req.query.limit) || 20;
   const skip = (page - 1) * limit;

   //records count 
   const total = await Companies.countDocuments(queryResult);
   const numOfPage = Math.ceil(total / limit);

   // move to next page
//  queryResult = queryResult.skip(skip).limit(limit);

    //  show more listings instead of moving to the next page
    queryResult = queryResult.limit(limit * page);
    
    const companies = await queryResult;

 res.status(200).json({
    success: true,
    total,
    data: companies,
    page, 
    numOfPage,
 });
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message});
        
    }
};

// GET COMPANY JOBS
export const getCompanyJobListing = async (req, res, next) => {
    const { search, sort} = req.query;
    const id = req.body.user.userId;

    try {
        // conditions for searching filters
        const queryObject = {};

        if(search) {
            queryObject.location = {$regex: search, $options: "i"};

        }

        let sorting;

        if(sort === "Newest"){
            sorting = "-createAt";
        }
        if(sort === "Oldest"){
            sorting = "createAt";
        }
        if(sort === "A-Z"){
            sorting = "name";
        }
        if(sort === "Z-A"){
            sorting = "-name";
        }

        let queryResult = await Companies.findById({ _id: id}).populate({
            path: "jobPosts",
            options: { sort: sorting},
        });

        const companies = await queryResult;

        res.status(200).json({
            success: true,
            companies,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message});
        
    }
};

export const getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const company = await Companies.findById({ _id: id }).populate({
            path: "jobPosts",
            options: {
                sort: "-_id",
            },
        });

        if (!company) {
            return res.status(200).send({
                message: "Company Not Found",
                success: false,
            });
        }

        company.password = undefined;
        res.status(200).json({
            success: true,
            data: {
                ...company.toObject(),
                role: company.role // Include role in response
            },
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};


export const getCompanyApplications = async (req, res) => {
    const { companyId } = req.params;
  
    try {
      // Validate companyId
      if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(400).json({ success: false, message: 'Invalid company ID' });
      }
  
      const jobs = await Jobs.find({ company: companyId });
  
      if (!jobs.length) {
        return res.status(404).json({ success: false, message: 'No jobs found for this company' });
      }
  
      const jobIds = jobs.map(job => job._id);
      const applications = await Applications.find({ job: { $in: jobIds } }).populate('user');
  
      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };