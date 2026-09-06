import prisma from "../utils/prisma.js";
import { formatJob } from "../utils/format.js";

// admin job post
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, exprience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || exprience === undefined || !position || !companyId) {
            return res.status(400).json({
                message: "Please fill all the fields",
                status: false,
                success: false
            });
        }

        const requirementsArray = typeof requirements === "string"
            ? requirements.split(",").map(r => r.trim()).filter(Boolean)
            : Array.isArray(requirements) ? requirements : [];

        const job = await prisma.job.create({
            data: {
                title,
                description,
                requirements: requirementsArray,
                salary: Number(salary),
                location,
                jobType,
                exprienceLevel: Number(exprience),
                position: Number(position),
                companyId,
                createdById: userId
            },
            include: {
                company: true
            }
        });

        return res.status(201).json({
            message: "New Job created successfully.",
            job: formatJob(job),
            success: true
        });
    } catch (error) {
        console.error("Post Job Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// user/student jobs listing with search keyword
export const getAllJobs = async (req, res) => {
    try {
        const Keyword = req.query.Keyword || "";

        const whereCondition = Keyword.trim() !== "" ? {
            OR: [
                { title: { contains: Keyword, mode: 'insensitive' } },
                { description: { contains: Keyword, mode: 'insensitive' } },
                { location: { contains: Keyword, mode: 'insensitive' } },
            ]
        } : {};

        const jobs = await prisma.job.findMany({
            where: whereCondition,
            include: {
                company: true,
                applications: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            message: "Jobs found successfully.",
            jobs: jobs.map(formatJob),
            success: true
        });
    } catch (error) {
        console.error("Get All Jobs Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// get job by id
export const getjobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                company: true,
                applications: {
                    include: {
                        applicant: true
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
        console.error("Get Job By ID Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// get jobs posted by admin/recruiter
export const getAdminjobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await prisma.job.findMany({
            where: { createdById: adminId },
            include: {
                company: true,
                applications: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            jobs: jobs.map(formatJob),
            success: true
        });
    } catch (error) {
        console.error("Get Admin Jobs Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
