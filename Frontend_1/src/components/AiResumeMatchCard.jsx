import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';
import axios from 'axios';
import { AI_API_END_POINT } from './utils/constant';
import { toast } from 'sonner';

const AiResumeMatchCard = ({ jobId, user }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!user) {
            toast.error('Please log in to analyze your resume match');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${AI_API_END_POINT}/analyze-resume-match`,
                { jobId },
                { withCredentials: true }
            );

            if (res.data.success) {
                setAnalysis(res.data.analysis);
                toast.success('Resume match analysis complete!');
            }
        } catch (error) {
            console.error('ATS analysis error:', error);
            toast.error(error.response?.data?.message || 'Failed to analyze resume match');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-rose-600 bg-rose-50 border-rose-200';
    };

    const getProgressBarColor = (score) => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 60) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <div className="bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-white border border-purple-100 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-purple-100/80 rounded-xl text-[#6A38C2]">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            AI Resume & ATS Fit Checker
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                                Powered by Gemini
                            </span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Evaluate how well your uploaded resume and skills align with this position.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            {user?.profile?.resumeOriginalName ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                                    📄 Resume: {user.profile.resumeOriginalName}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                                    💡 Using Profile Skills & Bio (Upload resume in Profile for higher ATS score)
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-white hover:bg-purple-50 text-[#6A38C2] border border-purple-200 shadow-xs rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 px-4 py-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing Profile...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            {analysis ? 'Re-Analyze Fit' : 'Check ATS Score'}
                        </>
                    )}
                </Button>
            </div>

            {analysis && (
                <div className="mt-6 pt-5 border-t border-purple-100/80 space-y-5 animate-in fade-in duration-300">
                    {/* Score Bar & Verdict */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-xl font-bold text-xl border ${getScoreColor(analysis.matchScore)}`}>
                                {analysis.matchScore}%
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Match Verdict</p>
                                <p className="text-sm font-bold text-gray-900 mt-0.5">{analysis.verdict || "Match Assessment"}</p>
                            </div>
                        </div>

                        <div className="w-full sm:w-48">
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-700 ${getProgressBarColor(analysis.matchScore)}`}
                                    style={{ width: `${Math.min(100, Math.max(0, analysis.matchScore))}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    {analysis.summary && (
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-white/70 p-3.5 rounded-xl border border-purple-100/50">
                            {analysis.summary}
                        </p>
                    )}

                    {/* Skills Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Matching Skills */}
                        <div className="bg-white p-4 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs mb-2.5">
                                <CheckCircle2 className="w-4 h-4" />
                                Matching Profile Skills
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {analysis.matchingSkills?.length > 0 ? (
                                    analysis.matchingSkills.map((skill, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No exact skill overlap identified</p>
                                )}
                            </div>
                        </div>

                        {/* Missing Skills */}
                        <div className="bg-white p-4 rounded-xl border border-amber-100">
                            <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-xs mb-2.5">
                                <AlertCircle className="w-4 h-4" />
                                Missing / Target Skills
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {analysis.missingSkills?.length > 0 ? (
                                    analysis.missingSkills.map((skill, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200 text-xs">
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic">Great! You have covered core requirements.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    {analysis.recommendations?.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-2">
                            <div className="flex items-center gap-1.5 text-purple-800 font-semibold text-xs">
                                <Lightbulb className="w-4 h-4 text-purple-600" />
                                AI Tips to Improve Your Chance of Getting Shortlisted
                            </div>
                            <ul className="space-y-1.5">
                                {analysis.recommendations.map((tip, idx) => (
                                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                        <span className="text-purple-600 font-bold">•</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiResumeMatchCard;
