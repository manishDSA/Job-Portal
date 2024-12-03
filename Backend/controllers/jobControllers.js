import { Job } from "../models/jobmodel.js";


// admin job post
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, exprience, position, companyId } = req.body;
        const userId = req.id;
        // check all body item
        if (!title || !description || !requirements || !salary || !location || !jobType || !exprience || !position || !companyId) {
            return res.status(400).json({
                message: "Please fill all the fields",
                status: false
            })
        };
        //create a job
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            exprienceLevel: exprience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(200).json({
            message: " New Job created successfully",
            job,
            success: true
        });

    }
    catch (error) {
        console.log(error);

    }
}
// user/student job
export const getAllJobs = async (req, res) => {
    try {
        //filter the job using keyword
        const Keyword = req.query.Keyword || "";
        const query = {
            $or: [
                //here i is case sensetive
                { title: { $regex: Keyword, $options: "i" } },
                { description: { $regex: Keyword, $options: "i" } },
            ]
        };
        // populate use for get the actual infromation of user
        const jobs = await Job.find(query)
        // .populate({
        //     path:"company"
        // }).sort({createdAt: -1});
        .populate({
            path: "company",  
        })
        .sort({ createdAt: -1 });
        
        
        if (!jobs) {
            return res.status(404).json({
                message: "No jobs found",
                status: false
            })
        };
        return res.status(200).json({
            message: "Jobs found successfully",
            jobs,
            success: true,
        })
    }
    catch (error) {
        console.log(error);

    }
}

// user/student job
export const getjobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        };
        return res.status(200).json({
            job,
            success: true
        })
    }
    catch (error) {

    }
}

// how many create job by admin
export const getAdminjobs = async (req, res) => {
try {
    const adminId = req.id;
    const jobs = await Job.find({created_by: adminId }).populate({
        path: "company",
        createdAt:-1
    });
    if (!jobs) {
        return res.status(404).json({
            message: "No jobs found",
            status: false
        })
    }
    return res.status(200).json({
        jobs,
        success:true
    })
} 
catch (error) {
    console.log(error);
    
}
}

