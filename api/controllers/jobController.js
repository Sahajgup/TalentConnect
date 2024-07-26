import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";

export const createJob = async (req, res, next) => {
  try {
    const {
      company,
      companyLogo,
      jobType,
      jobTitle,
      location,
      batch,
      salary,
      experience,
      detail,
      stipend,
      skill_req,
      apply_url
    } = req.body;


    const jobPost = {
      company,
      companyLogo,
      jobTitle,
      jobType,
      location,
      batch,
      salary,
      experience,
      detail,
      stipend,
      skill_req,
      apply_url
    };

    const job = new Jobs(jobPost);
    await job.save();

    res.status(200).json({
      success: true,
      message: "Job Posted SUccessfully",
      job,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Check if jobId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(404).send
      (`Invalid Job ID: ${jobId}`);
    }

    const existingJob = await Jobs.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatedFields = {};
    for (const key in req.body) {
      if (req.body[key] !== undefined) {
        updatedFields[key] = req.body[key];
      }
    }

    // Update the job with the new values
    const updatedJob = await Jobs.findByIdAndUpdate(
      jobId,
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getJobPosts = async (req, res, next) => {
  try {
    console.log("fr",req.query.page,Number(req.query.page))
    const { search, location, jtype , page} = req.query;
    console.log(page,search,location);
    // const types = jtype?.split(","); 

    let queryObject = {};

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    if (jtype) {
      queryObject.jobType = { $regex: jtype, $options: "i" };
    }


    if (search) {
      console.log("shrey",search)
      const searchQuery = {
        $or: [
          { jobTitle: { $regex: search, $options: "i" } },
          { jobType: { $regex: search, $options: "i" } },
           {company: {$regex: search, $options: "i"}},
        ],
      };
      queryObject = { ...queryObject, ...searchQuery };
    }

    let queryResult = Jobs.find(queryObject);
   
    queryResult = queryResult.sort("-createdAt");

    // pagination
    const page1 = Number(page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page1 - 1) * limit;

    //records count
    const totalJobs = await Jobs.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    // console.log("shrey",page,limit,numOfPage,queryResult)

    queryResult = queryResult.limit(limit * page1);

   

    const jobs = await queryResult;

    // console.log("now",queryResult);

    res.status(200).json({
      success: true,
      totalJobs,
      data: jobs,
      page1,
      numOfPage,
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};


export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findById({ _id: id });

    if (!job) {
      return res.status(200).send({
        message: "Job Post Not Found",
        success: false,
      });
    }

    const searchQuery = {
      $or: [
        { jobType: { $regex: job?.jobType, $options: "i" } },
      ],
    };

    let queryResult = Jobs.find(searchQuery).sort({ _id: -1 });

    queryResult = queryResult.limit(6);
    const similarJobs = await queryResult;

    res.status(200).json({
      success: true,
      data: job,
      similarJobs,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};


export const saveJob = async (req, res, next) => {
  try {
    const user = await Users.findOne({ email: req.body.user.email });
    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobId = req.body.jobId;
    console.log(jobId);
   

    const updatedUser = await Users.findByIdAndUpdate(
      user._id,
      { $addToSet: { savedJobs: jobId } }, 
      { new: true }
    );
    console.log("found",jobId,"and",updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteJob = async (req, res, next) => {
  try {
    const user = await Users.findOne({ email: req.body.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobId = req.body.jobId;

    const updatedUser = await Users.findByIdAndUpdate(
      user._id,
      { $pull: { savedJobs: jobId } }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const deleteJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Jobs.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      messsage: "Job Post Delted Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};



export const  getSavedJobs = async (req, res, next) => {
  try {

    console.log("hii i am saved",req.body)


    const user = await Users.findOne({ email: req.body.email });

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedJobs = user.savedJobs;

    console.log("hii",savedJobs);

    const savedJobsDetails = [];
    for (const jobId of savedJobs) {
      const job = await Jobs.findById(jobId);
      if (job) {
        savedJobsDetails.push(job);
      }
    }

    res.status(200).json({ success: true, savedJobs: savedJobsDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


