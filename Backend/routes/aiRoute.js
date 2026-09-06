import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import {
    generateJobDescription,
    analyzeResumeMatch,
    generateCoverLetter,
    getInterviewPrep,
    rankJobApplicants,
    parseResume,
} from "../controllers/aiControllers.js";

const aiRouter = express.Router();

// Auto-parse Resume & Extract Profile Details
aiRouter.route("/parse-resume").post(isAuthenticated, singleUpload, parseResume);

// Generate Job Description & Requirements
aiRouter.route("/generate-job-description").post(isAuthenticated, generateJobDescription);

// ATS Resume & Skill Gap Analysis
aiRouter.route("/analyze-resume-match").post(isAuthenticated, analyzeResumeMatch);

// Tailored Cover Letter Generator
aiRouter.route("/generate-cover-letter").post(isAuthenticated, generateCoverLetter);

// Interview Preparation Assistant
aiRouter.route("/interview-prep/:jobId").get(isAuthenticated, getInterviewPrep);

// Rank & Evaluate Applicants for a Job
aiRouter.route("/rank-applicants/:jobId").get(isAuthenticated, rankJobApplicants);


export default aiRouter;
