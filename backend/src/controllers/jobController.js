import mongoose from "mongoose";

export const createJob = async (req, res, next) => {
   try{ 
    const {
        jobTitle,
        jobType,
        location,
        salary,
        vacancies,
        experience,
        desc,
        requirements,
    } = req.body;

    if(!jobTitle || !jobType || !location || !salary || !requirements || !desc ) {
        next("Please Provide All Required Fields");
        return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No Company with id: ${id}`);

    const jobPost = {
        jobTitle,
        jobType,
        location,
        salary,
        vacancies,
        experience,
        detail: { desc, requirements},
        company: id,
    };

    const job = new Jobs(jobPost);
    await job.save();

    // Update the company information with job id
     const company = await Companies.findById(id);

     company.jobPosts.push(job._id);
      const updateCompany = await Companies.findByIdAndUpdate(id, company, {
 new: true,
      });

      res.status(200).json({
        success: true,
        message: "Job Posted Successfully",
        job,
      });

} catch (error) {
    console.log(error);
    res.status(404).json({message: error.message});
    
}
};
export const updateJob = async (req, res, next) => {
    try{ 
        const {
            jobTitle,
            jobType,
            location,
            salary,
            vacancies,
            experience,
            desc,
            requirements,
        } = req.body;
        const {jobId} = req.params;

        if(!jobTitle || !jobType || !location || !salary || !requirements || !desc ) {
            next("Please Provide All Required Fields");
            return;
        }
        const id = req.body.user.userId;
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No Company with id: ${id}`);
         
        const jobPost = {
            jobTitle,
            jobType,
            location,
            salary,
            vacancies,
            experience,
            detail: { desc, requirements},
            _id: jobId,
        };
    
        await Jobs.findByIdAndUpdate(jobId, jobPost, {
            new: true,
                 });

               res.status(200).json({
                    success: true,
                    message: "Job Post Updated Successfully",
                    job,
              });


    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message});
        
    }
};
export const getJobPosts =  async (req, res, next) => {
    try{ 
        const {search, sort, location,jtype, exp} = req.query;
        const types = jtype?.split(",");
        const experience = exp?.split("-");

        let queryObject = {};

        if(location){
            queryObject.location = {$regex: location, $options: "i"};
        }
        if(jtype){
            queryObject.jobType = {$in: types};
        }

        if(exp) {
            queryObject.experience = {
                $gte: experience[0],
                $lte: experience[1],
            };
        }

        if(search){
            const searchQuery = {
                $or:[
                    {jobTitle: {$regex:search, $options:"i"}},
                    {jobType: {$regex:search, $options:"i"}},
                ],
            };
            queryObject = { ...queryObject, ...searchQuery};
        }

        let queryResult = Jobs.find(queryObject).populate({
            path: "company",
            select: "-password",
        });

              //SORTING Jobs
   if(sort === "Newest") {
    queryResult = queryResult.sort("-createAt");
   }
   if(sort === "Oldest") {
    queryResult = queryResult.sort("createAt");
   }
   if(sort === "A-Z") {
    queryResult = queryResult.sort("jobTitle");
   }
   if(sort === "Z-A") {
    queryResult = queryResult.sort("-jobTitle");
   }

     //PADINATION
     const page = Number(req.query.page) || 1;
     const limit = Number(req.query.limit) || 20;
     const skip = (page - 1) * limit;

       //records count 
   const totalJobs = await Jobs.countDocuments(queryResult);
   const numOfPage = Math.ceil(totalJobs / limit);

   queryResult = queryResult.limit(limit * page);
    
   const jobs = await queryResult;

   
 res.status(200).json({
    success: true,
    totalJobs,
    data: jobs,
    page, 
    numOfPage,
 });

    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message});
        
    }
};
export const getJobById =  async (req, res, next) => {
    try{ 
        const {id} = req.params;

        const job = await Jobs.findById({_id: id}).populate({
            path: "company",
           select: "-password",
        });
        
        if(!job) {
            return res.status(200).send({
                message: "Job Post Not Found",
                success: false,
            });
        }

        // GET SIMILAR JOB POSTS
        const searchQuery = {
            $or:[
                {jobTitle: {$regex:jobTitle, $options:"i"}},
                {jobType: {$regex:jobType, $options:"i"}},
            ],
        };

        
        let queryResult = Jobs.find(searchQuery)
        .populate({
            path: "company",
            select: "-password",
        }).sort({_id: -1});

        queryResult = queryResult.limit(6);
        const similarJobs = await queryResult;

        res.status(200).json({
            success: true,
           data: job,
           similarJobs,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message});
        
    }
};
export const deleteJobPost = async (req, res, next) => {
    try{ 
    
        const {id} = req.params;
        await Jobs.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
           message: "Job Post Deleted Successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message});
        
    }
};