export const formatUser = (user) => {
  if (!user) return null;
  return {
    _id: user.id,
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: {
      bio: user.bio || "",
      skills: user.skills || [],
      resume: user.resume || "",
      resumeOriginalName: user.resumeOriginalName || "",
      profilephoto: user.profilePhoto || "",
      profilePhoto: user.profilePhoto || ""
    },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export const formatCompany = (company) => {
  if (!company) return null;
  return {
    _id: company.id,
    id: company.id,
    name: company.name,
    description: company.description || "",
    website: company.website || "",
    location: company.location || "",
    logo: company.logo || "",
    userId: company.userId,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt
  };
};

export const formatJob = (job) => {
  if (!job) return null;
  return {
    _id: job.id,
    id: job.id,
    title: job.title,
    description: job.description,
    requirements: job.requirements || [],
    salary: job.salary,
    exprienceLevel: job.exprienceLevel,
    location: job.location,
    jobType: job.jobType,
    position: job.position,
    company: job.company ? formatCompany(job.company) : job.companyId,
    created_by: job.createdById,
    createdById: job.createdById,
    applications: (job.applications || []).map(formatApplication),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  };
};

export const formatApplication = (application) => {
  if (!application) return null;
  return {
    _id: application.id,
    id: application.id,
    job: application.job ? formatJob(application.job) : application.jobId,
    applicant: application.applicant ? formatUser(application.applicant) : application.applicantId,
    status: application.status,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt
  };
};
