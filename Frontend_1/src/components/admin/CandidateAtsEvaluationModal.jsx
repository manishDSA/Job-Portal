import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Lightbulb, UserCheck, FileText } from 'lucide-react';
import axios from 'axios';
import { AI_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';
import ResumeViewerModal from '../ResumeViewerModal';

const CandidateAtsEvaluationModal = ({ applicant, jobId, jobTitle }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const applicantUser = applicant?.applicant || applicant;
    const applicantId = applicantUser?.id || applicantUser?._id || applicant?.applicantId || applicant?.id || applicant?._id;
    const resumeUrl = applicantUser?.profile?.resume || applicantUser?.resume;
    const resumeName = applicantUser?.profile?.resumeOriginalName || applicantUser?.resumeOriginalName || "Resume.pdf";

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (isOpen && !analysis) {
            handleAnalyze();
        }
    };

    const handleAnalyze = async () => {
        if (!jobId || !applicantId) {
            toast.error("Job or Applicant information missing");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${AI_API_END_POINT}/analyze-resume-match`,
                { jobId, applicantId },
                { withCredentials: true }
            );

            if (res.data.success) {
                setAnalysis(res.data.analysis);
            }
        } catch (error) {
            console.error("ATS Candidate check error:", error);
            toast.error(error.response?.data?.message || "Failed to analyze candidate resume");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
        return 'text-rose-700 bg-rose-50 border-rose-200';
    };

    const getProgressBarColor = (score) => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 60) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1.5 border-indigo-300 text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-semibold px-3 py-1.5 shadow-xs"
                >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    ATS Check
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
                <DialogHeader>
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                                <UserCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-gray-900">
                                    Candidate ATS Evaluation
                                </DialogTitle>
                                <DialogDescription className="text-xs text-gray-500">
                                    Evaluating <strong className="text-gray-800">{applicantUser?.fullname}</strong> for {jobTitle || "Job Position"}
                                </DialogDescription>
                            </div>
                        </div>

                        {resumeUrl && (
                            <ResumeViewerModal
                                resumeUrl={resumeUrl}
                                originalName={resumeName}
                                triggerText="View Document"
                            />
                        )}
                    </div>
                </DialogHeader>

                {loading ? (
                    <div className="py-12 text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                        <p className="text-xs text-gray-600 font-medium">
                            Analyzing candidate profile & resume skills against job requirements...
                        </p>
                    </div>
                ) : analysis ? (
                    <div className="space-y-4 my-2 animate-in fade-in duration-300">
                        {/* Match Score & Verdict */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                            <div className="flex items-center gap-4">
                                <div className={`px-3.5 py-1.5 rounded-xl font-bold text-lg border ${getScoreColor(analysis.matchScore)}`}>
                                    {analysis.matchScore}%
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                                        ATS Assessment
                                    </p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                                        {analysis.verdict || "Match Verdict"}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full sm:w-44">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-2.5 rounded-full transition-all duration-700 ${getProgressBarColor(analysis.matchScore)}`}
                                        style={{ width: `${Math.min(100, Math.max(0, analysis.matchScore))}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        {analysis.summary && (
                            <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-700 leading-relaxed">
                                <strong className="font-semibold text-gray-900 block mb-1">AI Match Summary:</strong>
                                {analysis.summary}
                            </div>
                        )}

                        {/* Candidate Skills Breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-200">
                                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Candidate's Matching Skills
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {analysis.matchingSkills?.length > 0 ? (
                                        analysis.matchingSkills.map((s, idx) => (
                                            <Badge key={idx} variant="secondary" className="bg-white text-emerald-700 border border-emerald-200 text-xs">
                                                {s}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No exact skill matches detected</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-200">
                                <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-xs mb-2">
                                    <AlertCircle className="w-4 h-4 text-amber-600" />
                                    Missing / Skills to Probe
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {analysis.missingSkills?.length > 0 ? (
                                        analysis.missingSkills.map((s, idx) => (
                                            <Badge key={idx} variant="secondary" className="bg-white text-amber-700 border border-amber-200 text-xs">
                                                {s}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">All essential skills covered</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recommendations / Interview Probe */}
                        {analysis.recommendations?.length > 0 && (
                            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                                <div className="flex items-center gap-1.5 text-indigo-950 font-semibold text-xs">
                                    <Lightbulb className="w-4 h-4 text-indigo-600" />
                                    Key Observations & Hiring Insights
                                </div>
                                <ul className="space-y-1">
                                    {analysis.recommendations.map((tip, idx) => (
                                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                                            <span className="text-indigo-600 font-bold">•</span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-8 text-center">
                        <Button
                            onClick={handleAnalyze}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold px-4 py-2"
                        >
                            Start ATS Evaluation
                        </Button>
                    </div>
                )}

                <DialogFooter className="flex sm:justify-between items-center gap-2 pt-2">
                    {analysis && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="text-xs rounded-xl"
                        >
                            Re-Evaluate
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="rounded-xl text-gray-600 ml-auto text-xs"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CandidateAtsEvaluationModal;
