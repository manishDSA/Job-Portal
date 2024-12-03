import { Application } from "../models/application.js";
import { Job } from "../models/jobmodel.js";


export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        // const {id:jobId}= req.params;
        if (!jobId) {
            return res.status(400).json(
                {
                    message: "Job id is required",
                    success: false
                })

        }
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId })
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            })
        }
        //check if jobs not exist
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false

            })
        }
        //create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId

        });
        //save the application
        // push the applied user id and infromation in applications arrya in job model
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"job applied successfully",
            success: true
        })
    }
    catch (error) {
        console.log(error);

    }
};

// get the all applied  job
 export const getAppliedJobs = async (req, res) => {
try {
    const userId = req.id;
    // find the job where applicant applied and sort the accending order
    const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
        path: 'job',
        options:{sort:{createdAt:-1}},
        populate:{
            path:'company',
            options:{sort:{createdAt:-1}},
        }
    });
    if (!application) {
        return res.status(404).json({
            message: "No job applied",
            success: false
        })
    }
    return res.status(200).json({
        application,
        success: true
    })
} 
catch (error) {
console.log(error);
    
}
}

// get the applicants
// admin check the how many user applied in one job
export const getApplicants = async (req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant',
                }
        });
        if (!job) {
            return res.status(404).json({
                message:"Job not found.",
                success:false
            })
        };
        return res.status(200).json({
            job,
            success:true
        })
    } 
    catch (error) {
       console.log(error);
        
    }
}

// update Status for applie user
export const updateStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            })
        };
        //find the appication by application id
        const application = await Application.findOne({_id:applicationId});
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            })
        };
        //update the status
        application.status = status.toLowerCase();
        await application.save();
        
        return res.status(200).json({
            message: "Status updated successfully",
            success: true
        })

    } 
    catch (error) {
       console.log(error);
        
    }
}