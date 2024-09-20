import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModel.js";

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


// export const createJob = async (req, res, next) => {
    
//     const { jobTitle, jobType, location, salary, vacancies, experiences, detail } = req.body;
//     const companyId = req.params.companyId; // Get companyId from route parameters
//     console.log('Incoming request body:', req.body);
    
//     try {
//         if (!jobTitle || !jobType || !location || !salary || !vacancies || !experiences || !Array.isArray(detail) || detail.length === 0 || !detail[0]?.desc || !detail[0]?.requirements) {
//             return res.status(400).json({ success: false, message: 'Please provide all required fields' });
//           }

//         // Find the company making the request
//         const company = await Companies.findById(companyId);

//         if (!company) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Company not found",
//             });
//         }

//         // Create a new job
//         const newJob = await Jobs.create({
//             company: companyId,
//             jobTitle,
//             jobType,
//             location,
//             salary,
//             vacancies,
//             experiences,
//             detail,
//         });

//         // Save the job and update the company's jobPosts
//         company.jobPosts.push(newJob._id);
//         await company.save();

//         res.status(201).json({
//             success: true,
//             message: "Job created successfully",
//             job: newJob,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "An error occurred while creating the job",
//             error: error.message,
//         });
//     }
// };
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
  const {name, contact, location, profileUrl, about } = req.body;

  try {
    // validation 
    if(!name || !location || !about || !contact || !profileUrl ){
        next("Please Provide All Required Fields");
        return;
    }
    const id = req.body.user.userId;
    if(!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Company with id: ${id}`);

    const updateCompany = {
        name, 
        contact,
        location,
        profileUrl,
        about,
        _id: id,
    };

    const company = await Companies.findByIdAndUpdate(id, updateCompany,{
        new: true,
    });

     const token = company.createJWT();

     company.password = undefined;

     res.status(200).json({
        success: true,
        message: "Company Profile Update Successfully",
        company, 
        token,
     });

  } catch (error) {
    console.log(error);
    res.status(404).json({message: error.message});
    
  }


};

export const getCompanyProfile = async (req, res, next) => {
    
    try {
        const id = req.body.user.userId;

        const company = await Companies.findById({_id: id});

        if(!company){
            return res.status(200).send({
                message: "Company Not Found",
                success: false,
            });
        }

        company.password = undefined;
           res.status(200).json({
            success: true,
            data: company,
           });

    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message});
        
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
