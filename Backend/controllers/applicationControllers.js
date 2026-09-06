import prisma from "../utils/prisma.js";
import { formatApplication, formatJob } from "../utils/format.js";

// apply for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required",
                success: false
            });
        }

        // check if user already applied
        const existingApplication = await prisma.application.findFirst({
            where: {
                jobId,
                applicantId: userId
            }
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // check if job exists
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // create new application
        const newApplication = await prisma.application.create({
            data: {
                jobId,
                applicantId: userId
            }
        });

        return res.status(201).json({
            message: "Job applied successfully.",
            application: formatApplication(newApplication),
            success: true
        });
    } catch (error) {
        console.error("Apply Job Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// get all jobs applied by the logged-in student
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await prisma.application.findMany({
            where: { applicantId: userId },
            include: {
                job: {
                    include: {
                        company: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            application: applications.map(formatApplication),
            success: true
        });
    } catch (error) {
        console.error("Get Applied Jobs Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// get applicants for a specific job (admin / recruiter)
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                company: true,
                applications: {
                    include: {
                        applicant: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job: formatJob(job),
            success: true
        });
    } catch (error) {
        console.error("Get Applicants Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// update application status (accepted / rejected / pending)
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            });
        }

        const validStatuses = ["pending", "accepted", "rejected"];
        if (!validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({
                message: "Invalid status value. Must be 'pending', 'accepted', or 'rejected'",
                success: false
            });
        }

        const application = await prisma.application.findUnique({
            where: { id: applicationId }
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }

        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: {
                status: status.toLowerCase()
            }
        });

        return res.status(200).json({
            message: "Status updated successfully.",
            application: formatApplication(updatedApplication),
            success: true
        });
    } catch (error) {
        console.error("Update Status Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};