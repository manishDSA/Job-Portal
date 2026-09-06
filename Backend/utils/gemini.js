import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({});

const getApiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

const getAiClient = () => {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    return new GoogleGenAI({ apiKey });
};

// Robust content generator with modern Gemini models and fallbacks
const generateContentSafe = async (prompt) => {
    const ai = getAiClient();
    const modelsToTry = [
        "gemini-flash-latest",
        "gemini-2.5-flash",
        "gemini-3.6-flash",
        "gemini-3.7-flash",
        "gemini-3.5-flash",
        "gemini-pro-latest"
    ];
    let lastError = null;

    for (const model of modelsToTry) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
            });
            if (response && response.text) {
                return response.text;
            }
        } catch (err) {
            lastError = err;
            console.warn(`Model ${model} failed, attempting next fallback...`, err.message);
        }
    }

    throw lastError || new Error("Failed to generate content with available Gemini models.");
};

// Helper to extract JSON from AI response if wrapped in markdown code blocks
const extractJson = (text) => {
    try {
        const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim();
        return JSON.parse(cleaned);
    } catch (e) {
        const start = text.search(/[\{\[]/);
        const end = text.lastIndexOf(/\}/) > -1 ? text.lastIndexOf(/\}/) + 1 : text.lastIndexOf(/\]/) + 1;
        if (start !== -1 && end > start) {
            return JSON.parse(text.slice(start, end));
        }
        throw new Error("Failed to parse AI response as JSON: " + text);
    }
};

/**
 * Parse uploaded resume document (PDF or image) and extract candidate details
 */
export const parseResumeAI = async (fileBuffer, mimeType, filename) => {
    const ai = getAiClient();
    const base64Data = fileBuffer.toString("base64");

    const prompt = `
You are an expert HR and AI Resume Parser.
Analyze the attached resume file and extract key candidate details:
1. Full Name
2. Email
3. Phone Number
4. A professional 2-3 sentence Bio / Summary
5. Key Technical & Professional Skills (list of individual skill names)

Return ONLY a valid JSON object matching this schema:
{
  "fullname": "<Extracted full name or empty string>",
  "email": "<Extracted email address or empty string>",
  "phoneNumber": "<Extracted phone number or empty string>",
  "bio": "<2-3 sentence professional summary>",
  "skills": ["Skill 1", "Skill 2", "Skill 3"]
}
Do not include any extra text outside the JSON.`;

    const contents = [
        {
            role: "user",
            parts: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType || "application/pdf",
                    },
                },
                { text: prompt },
            ],
        },
    ];

    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents,
    });

    const responseText = response.text || "";
    return extractJson(responseText);
};


/**
 * Auto-generate job description, key requirements, and suggested salary/role info
 */
export const generateJobDescriptionAI = async ({ title, experienceLevel, location, jobType, companyName }) => {
    const prompt = `
You are an expert HR and recruitment consultant. Generate a compelling, modern, and professional job posting based on the following inputs:
- Job Title: ${title || "Software Engineer"}
- Experience Level: ${experienceLevel !== undefined ? `${experienceLevel} years` : "Entry/Mid Level"}
- Location: ${location || "Remote / Hybrid"}
- Job Type: ${jobType || "Full-time"}
- Company Name: ${companyName || "Tech Company"}

Return ONLY a valid JSON object matching this schema:
{
  "description": "A comprehensive 2-3 paragraph job summary including overview, what the candidate will do, and company culture.",
  "requirements": ["Skill / Requirement 1", "Skill / Requirement 2", "Skill / Requirement 3", "Skill / Requirement 4", "Skill / Requirement 5", "Skill / Requirement 6"],
  "suggestedSalaryRange": "e.g. 6 - 12 LPA or $70,000 - $100,000",
  "recommendedPositions": 1
}
Do not include any other markdown formatting outside of the JSON.`;

    const responseText = await generateContentSafe(prompt);
    return extractJson(responseText);
};

/**
 * Analyze candidate profile / skills vs job requirements (ATS Match Score & Gap Analysis)
 */
export const analyzeResumeMatchAI = async ({ userProfile, jobDetails }) => {
    const prompt = `
You are an advanced Applicant Tracking System (ATS) and Career Coach.
Compare the following candidate profile against the job posting and evaluate their fit:

[JOB POSTING]
- Title: ${jobDetails.title}
- Description: ${jobDetails.description}
- Required Skills/Requirements: ${(jobDetails.requirements || []).join(", ")}
- Experience Level Needed: ${jobDetails.exprienceLevel || 0} years
- Location: ${jobDetails.location}

[CANDIDATE PROFILE]
- Name: ${userProfile.fullname}
- Bio: ${userProfile.bio || "None provided"}
- Listed Skills: ${(userProfile.skills || []).join(", ")}
- Resume File Name: ${userProfile.resumeOriginalName || "Resume uploaded"}

Analyze the candidate's fit thoroughly. Return ONLY a valid JSON object with the exact format:
{
  "matchScore": <integer between 0 and 100>,
  "verdict": "<short verdict like Strong Match, Moderate Match, or Needs Skill Enhancement>",
  "summary": "<2-3 sentence overview of how well the candidate aligns with the role>",
  "matchingSkills": ["Skill 1", "Skill 2"],
  "missingSkills": ["Missing skill 1", "Missing skill 2"],
  "recommendations": [
    "Actionable tip 1 to improve resume or prepare for this role",
    "Actionable tip 2",
    "Actionable tip 3"
  ]
}
Do not include any extra text outside the JSON.`;

    const responseText = await generateContentSafe(prompt);
    return extractJson(responseText);
};

/**
 * Generate a personalized cover letter for the applicant targeting this specific job
 */
export const generateCoverLetterAI = async ({ userProfile, jobDetails }) => {
    const prompt = `
You are a professional career writer. Write a tailored, persuasive, and authentic cover letter for:
Candidate: ${userProfile.fullname}
Candidate Bio: ${userProfile.bio || ""}
Candidate Skills: ${(userProfile.skills || []).join(", ")}

Target Job:
- Title: ${jobDetails.title}
- Company: ${jobDetails.company?.name || "Hiring Team"}
- Job Description: ${jobDetails.description}
- Job Requirements: ${(jobDetails.requirements || []).join(", ")}

The cover letter should be professional, standard formal letter format, highlighting candidate's relevant skills, passion for the role, and call to action for an interview.
Return plain text (or markdown formatted text) with proper paragraphs.`;

    const responseText = await generateContentSafe(prompt);
    return responseText.trim();
};

/**
 * Generate interview preparation questions and tips for a specific job
 */
export const generateInterviewPrepAI = async ({ jobDetails }) => {
    const prompt = `
You are a senior hiring manager and tech interviewer.
Create realistic interview practice questions and preparation advice for this job:
- Job Title: ${jobDetails.title}
- Description: ${jobDetails.description}
- Required Skills: ${(jobDetails.requirements || []).join(", ")}
- Experience Level: ${jobDetails.exprienceLevel || 0} years

Generate 5 high-impact interview questions (mix of technical, situational, and behavioral) along with guidance.
Return ONLY a valid JSON object matching:
{
  "roleOverview": "<1-2 sentence summary of what interviewers focus on for this role>",
  "questions": [
    {
      "question": "<Interview question>",
      "category": "<Technical | Behavioral | Problem Solving | System Design>",
      "whyAsked": "<Brief explanation of what the interviewer is evaluating>",
      "sampleAnswer": "<Concise bullet points or framework on how to structure a winning answer>",
      "keyTips": "<Actionable tip for candidate>"
    }
  ]
}
Do not include any extra text outside the JSON.`;

    const responseText = await generateContentSafe(prompt);
    return extractJson(responseText);
};

/**
 * Rank and summarize multiple applicants for a recruiter
 */
export const rankApplicantsAI = async ({ jobDetails, applicants }) => {
    const applicantsSummary = applicants.map((app, index) => ({
        index: index,
        applicantId: app.applicantId || app.applicant?.id,
        name: app.applicant?.fullname || `Candidate #${index + 1}`,
        bio: app.applicant?.bio || "N/A",
        skills: app.applicant?.skills || [],
    }));

    const prompt = `
You are an expert recruitment AI assisting a hiring manager.
Rank and evaluate the following candidates against the job posting.

[JOB POSTING]
- Title: ${jobDetails.title}
- Description: ${jobDetails.description}
- Requirements: ${(jobDetails.requirements || []).join(", ")}
- Experience Needed: ${jobDetails.exprienceLevel || 0} years

[CANDIDATES]
${JSON.stringify(applicantsSummary, null, 2)}

Evaluate each candidate and provide a match score (0-100), quick summary, and recommendation.
Return ONLY a valid JSON array matching:
[
  {
    "applicantId": "<string applicantId>",
    "score": <number 0-100>,
    "recommendation": "<Strong Match | Good Fit | Partial Match | Low Fit>",
    "evaluationSummary": "<1-2 sentence evaluation of candidate fit>",
    "topSkillsMatched": ["Skill 1", "Skill 2"]
  }
]
Do not include any extra text outside the JSON.`;

    const responseText = await generateContentSafe(prompt);
    return extractJson(responseText);
};
