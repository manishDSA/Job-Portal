import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MoreHorizontal, Sparkles, Loader2, Info } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Application_API_END_POINT, AI_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';
import ResumeViewerModal from '../ResumeViewerModal';
import CandidateAtsEvaluationModal from './CandidateAtsEvaluationModal';

const shortlistedStatus = ["Accepted", "Rejected"];

const ApplicantsTable = ({ jobId }) => {
    const { applicants } = useSelector(store => store.application);
    const [rankingLoading, setRankingLoading] = useState(false);
    const [aiRankings, setAiRankings] = useState({});

    const currentJobId = jobId || applicants?.id || applicants?._id;
    const jobTitle = applicants?.title || "Job Position";

    const handleRankWithAI = async () => {
        if (!currentJobId) {
            toast.error("Job ID not found");
            return;
        }

        try {
            setRankingLoading(true);
            const res = await axios.get(`${AI_API_END_POINT}/rank-applicants/${currentJobId}`, {
                withCredentials: true,
            });

            if (res.data.success) {
                const rankingMap = {};
                (res.data.rankings || []).forEach(item => {
                    rankingMap[item.applicantId] = item;
                });
                setAiRankings(rankingMap);
                toast.success("AI Applicant evaluations loaded!");
            }
        } catch (error) {
            console.error("AI ranking error:", error);
            toast.error(error.response?.data?.message || "Failed to rank applicants with AI");
        } finally {
            setRankingLoading(false);
        }
    };

    const StatusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${Application_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const getScoreBadgeClass = (score) => {
        if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200";
        return "bg-rose-50 text-rose-700 border-rose-200";
    };

    const applications = applicants?.applications || [];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-4">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Applied Candidates</h3>
                    <p className="text-xs text-gray-500">
                        Review candidate profiles, open resumes, and run ATS match checks.
                    </p>
                </div>

                {applications.length > 0 && (
                    <Button
                        onClick={handleRankWithAI}
                        disabled={rankingLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold px-4 py-2 flex items-center gap-2 shadow-xs"
                    >
                        {rankingLoading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Evaluating All Candidates...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3.5 h-3.5" />
                                AI Candidate Ranking
                            </>
                        )}
                    </Button>
                )}
            </div>

            <Table>
                <TableCaption>A list of recent applicants for this position</TableCaption>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-gray-700">Full Name</TableHead>
                        <TableHead className="font-semibold text-gray-700">Email</TableHead>
                        <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                        <TableHead className="font-semibold text-gray-700">Resume Document</TableHead>
                        <TableHead className="font-semibold text-gray-700">Applied Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">ATS Evaluation</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((item) => {
                        const applicantId = item?.applicant?.id || item?.applicant?._id || item?.applicantId;
                        const aiEval = aiRankings[applicantId];
                        const resumeUrl = item?.applicant?.profile?.resume || item?.applicant?.resume;
                        const resumeName = item?.applicant?.profile?.resumeOriginalName || item?.applicant?.resumeOriginalName || "Resume.pdf";

                        return (
                            <TableRow key={item?.id || item?._id} className="hover:bg-gray-50/70">
                                <TableCell className="font-medium text-gray-900">{item?.applicant?.fullname}</TableCell>
                                <TableCell className="text-gray-600 text-xs">{item?.applicant?.email}</TableCell>
                                <TableCell className="text-gray-600 text-xs">{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {resumeUrl ? (
                                        <ResumeViewerModal
                                            resumeUrl={resumeUrl}
                                            originalName={resumeName}
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-400">No Resume</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-xs text-gray-500">
                                    {item?.createdAt ? item.createdAt.split('T')[0] : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {/* Individual ATS Check Modal Trigger */}
                                        <CandidateAtsEvaluationModal
                                            applicant={item}
                                            jobId={currentJobId}
                                            jobTitle={jobTitle}
                                        />

                                        {/* Bulk Evaluation Badge if available */}
                                        {aiEval && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button className="flex items-center gap-1 cursor-pointer">
                                                        <Badge className={`text-xs font-bold px-2 py-0.5 border ${getScoreBadgeClass(aiEval.score)}`}>
                                                            {aiEval.score}% - {aiEval.recommendation}
                                                        </Badge>
                                                        <Info className="w-3.5 h-3.5 text-gray-400 hover:text-indigo-600" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-72 bg-white p-3.5 shadow-lg rounded-xl border border-indigo-100 text-xs space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-gray-900">AI Evaluation</span>
                                                        <span className="font-bold text-indigo-700">{aiEval.score}% Fit</span>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed">{aiEval.evaluationSummary}</p>
                                                    {aiEval.topSkillsMatched?.length > 0 && (
                                                        <div>
                                                            <span className="font-semibold text-gray-700 block mb-1">Top Matches:</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {aiEval.topSkillsMatched.map((s, idx) => (
                                                                    <Badge key={idx} variant="secondary" className="text-[10px] bg-indigo-50 text-indigo-700">
                                                                        {s}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger className="p-1 rounded-lg hover:bg-gray-100 text-gray-600">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 bg-white p-1 rounded-xl shadow-md border border-gray-100">
                                            {shortlistedStatus.map((status, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => StatusHandler(status, item?.id || item?._id)}
                                                    className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors ${
                                                        status === 'Accepted' ? 'text-emerald-700' : 'text-rose-700'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
