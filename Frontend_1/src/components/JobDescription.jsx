import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { setSingleJob } from '@/Redux/jobSlice';
import { Application_API_END_POINT, JOB_API_END_POINT } from './utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Briefcase, Building2, Calendar, DollarSign, Loader2, MapPin, Users, Sparkles } from 'lucide-react';
import AiResumeMatchCard from './AiResumeMatchCard';
import AiCoverLetterModal from './AiCoverLetterModal';
import AiInterviewPrepModal from './AiInterviewPrepModal';

const JobDescription = () => {
    const params = useParams();
    const jobId = params.id;
    const { singleJob } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);

    const currentUserId = user?.id || user?._id;

    const isInitiallyApplied = singleJob?.applications?.some(
        (application) => application.applicant === currentUserId || application.applicantId === currentUserId || application === currentUserId
    ) || false;

    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${Application_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = {
                    ...singleJob,
                    applications: [...(singleJob?.applications || []), { applicant: currentUserId, applicantId: currentUserId }]
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to apply");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(
                        res.data.job.applications?.some(
                            (application) =>
                                application.applicant === currentUserId ||
                                application.applicantId === currentUserId ||
                                application?.applicant?.id === currentUserId ||
                                application?.applicant?._id === currentUserId ||
                                application === currentUserId
                        )
                    );
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, currentUserId]);

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col'>
            <Navbar />
            <main className='flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'>
                <div className='bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8'>
                    {/* Header: Title, Badges & Actions */}
                    <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200'>
                        <div>
                            <h1 className='font-bold text-2xl sm:text-3xl text-gray-900'>{singleJob?.title || "Job Title"}</h1>
                            <p className='text-sm text-gray-500 font-medium mt-1 flex items-center gap-1.5'>
                                <Building2 className='w-4 h-4 text-gray-400' />
                                {singleJob?.company?.name || "Company Name"}
                            </p>
                            <div className='flex flex-wrap items-center gap-2 mt-4'>
                                <Badge className='text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold text-xs border border-blue-100'>
                                    {singleJob?.position || 1} Positions
                                </Badge>
                                <Badge className='text-[#F83002] bg-orange-50 hover:bg-orange-100 font-semibold text-xs border border-orange-100'>
                                    {singleJob?.jobType || "Full Time"}
                                </Badge>
                                <Badge className='text-[#7209b7] bg-purple-50 hover:bg-purple-100 font-semibold text-xs border border-purple-100'>
                                    {singleJob?.salary} LPA
                                </Badge>
                            </div>
                        </div>

                        {/* Action buttons: AI Tools & Apply */}
                        <div className='flex flex-wrap items-center gap-3'>
                            <AiCoverLetterModal
                                jobId={jobId}
                                jobTitle={singleJob?.title}
                                companyName={singleJob?.company?.name}
                                user={user}
                            />

                            <AiInterviewPrepModal
                                jobId={jobId}
                                jobTitle={singleJob?.title}
                            />

                            <Button
                                onClick={isApplied || loading ? null : applyJobHandler}
                                disabled={isApplied || loading}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                                    isApplied
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-[#6A38C2] hover:bg-[#5b30a6] text-white shadow-md'
                                }`}
                            >
                                {loading ? (
                                    <span className='flex items-center gap-2'>
                                        <Loader2 className='w-4 h-4 animate-spin' /> Applying...
                                    </span>
                                ) : isApplied ? (
                                    'Already Applied'
                                ) : (
                                    'Apply Now'
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* AI ATS & Resume Match Assessment */}
                    <div className='mt-8'>
                        <AiResumeMatchCard jobId={jobId} user={user} />
                    </div>

                    {/* Job Details Grid */}
                    <div className='mt-8'>
                        <h2 className='text-lg font-bold text-gray-900 mb-6'>Job Information</h2>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50/70 p-5 sm:p-6 rounded-2xl border border-gray-100'>
                            <div className='flex items-start gap-3'>
                                <div className='p-2.5 bg-white rounded-xl shadow-xs text-[#6A38C2]'>
                                    <Briefcase className='w-5 h-5' />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Role / Title</p>
                                    <p className='text-sm font-semibold text-gray-900 mt-0.5'>{singleJob?.title || "N/A"}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='p-2.5 bg-white rounded-xl shadow-xs text-[#6A38C2]'>
                                    <MapPin className='w-5 h-5' />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Location</p>
                                    <p className='text-sm font-semibold text-gray-900 mt-0.5'>{singleJob?.location || "N/A"}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='p-2.5 bg-white rounded-xl shadow-xs text-[#6A38C2]'>
                                    <DollarSign className='w-5 h-5' />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Offered Salary</p>
                                    <p className='text-sm font-semibold text-gray-900 mt-0.5'>{singleJob?.salary} LPA</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='p-2.5 bg-white rounded-xl shadow-xs text-[#6A38C2]'>
                                    <Users className='w-5 h-5' />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Total Applicants</p>
                                    <p className='text-sm font-semibold text-gray-900 mt-0.5'>{singleJob?.applications?.length || 0}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='p-2.5 bg-white rounded-xl shadow-xs text-[#6A38C2]'>
                                    <Calendar className='w-5 h-5' />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Posted Date</p>
                                    <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                                        {singleJob?.createdAt ? singleJob.createdAt.split('T')[0] : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='p-2.5 bg-white rounded-xl shadow-xs text-[#6A38C2]'>
                                    <Briefcase className='w-5 h-5' />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Required Experience</p>
                                    <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                                        {singleJob?.exprienceLevel ?? 0} Years
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className='mt-8 space-y-4'>
                            <h3 className='text-base font-bold text-gray-900'>Description</h3>
                            <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-line'>
                                {singleJob?.description || "No description provided."}
                            </p>
                        </div>

                        {/* Requirements Section */}
                        {singleJob?.requirements && singleJob.requirements.length > 0 && (
                            <div className='mt-8 space-y-4'>
                                <h3 className='text-base font-bold text-gray-900'>Requirements & Skills</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {singleJob.requirements.map((req, idx) => (
                                        <Badge key={idx} variant="secondary" className='bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-lg'>
                                            {req.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobDescription;
