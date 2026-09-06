import prisma from "../utils/prisma.js";
import {
    generateJobDescriptionAI,
    analyzeResumeMatchAI,
    generateCoverLetterAI,
    generateInterviewPrepAI,
    rankApplicantsAI,
    parseResumeAI,
} from "../utils/gemini.js";

// 1. Generate Job Description & Requirements for Recruiters
export const generateJobDescription = async (req, res) => {
    try {
        const { title, experienceLevel, location, jobType, companyId } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Job title is required to generate description",
                success: false,
            });
        }

        let companyName = "Our Company";
        if (companyId) {
            const company = await prisma.company.findUnique({
                where: { id: companyId },
            });
            if (company?.name) companyName = company.name;
        }

        const result = await generateJobDescriptionAI({
            title,
            experienceLevel,
            location,
            jobType,
            companyName,
        });

        return res.status(200).json({
            message: "Job description generated successfully",
            data: result,
            success: true,
        });
    } catch (error) {
        console.error("AI generateJobDescription error:", error);
        return res.status(500).json({
            message: error.message || "Failed to generate job description with AI",
            success: false,
        });
    }
};

// 2. ATS Resume & Skill Gap Analysis
export const analyzeResumeMatch = async (req, res) => {
    try {
        const { jobId, applicantId } = req.body;
        const targetUserId = applicantId || req.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required for ATS resume analysis",
                success: false,
            });
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { company: true },
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        let user = await prisma.user.findUnique({
            where: { id: targetUserId },
        });

        // If not found directly, targetUserId might be an application ID
        if (!user) {
            const application = await prisma.application.findUnique({
                where: { id: targetUserId },
                include: { applicant: true },
            });
            if (application && application.applicant) {
                user = application.applicant;
            }
        }

        if (!user) {
            return res.status(404).json({
                message: "User profile not found",
                success: false,
            });
        }

        const analysis = await analyzeResumeMatchAI({
            userProfile: user,
            jobDetails: job,
        });

        return res.status(200).json({
            message: "Resume analyzed successfully",
            analysis,
            success: true,
        });
    } catch (error) {
        console.error("AI analyzeResumeMatch error:", error);
        return res.status(500).json({
            message: error.message || "Failed to analyze resume match with AI",
            success: false,
        });
    }
};

// 2.5 Auto-extract Profile details from uploaded resume file
export const parseResume = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Resume file is required for parsing",
                success: false,
            });
        }

        const extracted = await parseResumeAI(
            file.buffer,
            file.mimetype || "application/pdf",
            file.originalname
        );

        return res.status(200).json({
            message: "Resume parsed successfully",
            data: extracted,
            success: true,
        });
    } catch (error) {
        console.error("AI parseResume error:", error);
        return res.status(500).json({
            message: error.message || "Failed to parse resume with AI",
            success: false,
        });
    }
};


// 3. Tailored Cover Letter Generator
export const generateCoverLetter = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required to generate cover letter",
                success: false,
            });
        }

        const [job, user] = await Promise.all([
            prisma.job.findUnique({
                where: { id: jobId },
                include: { company: true },
            }),
            prisma.user.findUnique({
                where: { id: userId },
            }),
        ]);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const coverLetter = await generateCoverLetterAI({
            userProfile: user,
            jobDetails: job,
        });

        return res.status(200).json({
            message: "Cover letter generated successfully",
            coverLetter,
            success: true,
        });
    } catch (error) {
        console.error("AI generateCoverLetter error:", error);
        return res.status(500).json({
            message: error.message || "Failed to generate cover letter with AI",
            success: false,
        });
    }
};

// 4. Interview Preparation Assistant
export const getInterviewPrep = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required for interview prep",
                success: false,
            });
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { company: true },
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        const prep = await generateInterviewPrepAI({
            jobDetails: job,
        });

        return res.status(200).json({
            message: "Interview preparation generated successfully",
            prep,
            success: true,
        });
    } catch (error) {
        console.error("AI getInterviewPrep error:", error);
        return res.status(500).json({
            message: error.message || "Failed to generate interview prep with AI",
            success: false,
        });
    }
};

// 5. Rank and Evaluate All Applicants for a Job (Recruiter)
export const rankJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                applications: {
                    include: { applicant: true },
                },
            },
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        if (!job.applications || job.applications.length === 0) {
            return res.status(200).json({
                message: "No applicants found for this job yet",
                rankings: [],
                success: true,
            });
        }

        const rankings = await rankApplicantsAI({
            jobDetails: job,
            applicants: job.applications,
        });

        return res.status(200).json({
            message: "Applicants evaluated and ranked successfully",
            rankings,
            success: true,
        });
    } catch (error) {
        console.error("AI rankJobApplicants error:", error);
        return res.status(500).json({
            message: error.message || "Failed to rank applicants with AI",
            success: false,
        });
    }
};
