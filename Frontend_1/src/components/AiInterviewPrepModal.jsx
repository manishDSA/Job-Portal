import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Loader2, HelpCircle, ChevronDown, ChevronUp, Award } from 'lucide-react';
import axios from 'axios';
import { AI_API_END_POINT } from './utils/constant';
import { toast } from 'sonner';

const AiInterviewPrepModal = ({ jobId, jobTitle }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [prepData, setPrepData] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const handleFetchPrep = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${AI_API_END_POINT}/interview-prep/${jobId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setPrepData(res.data.prep);
                setExpandedQuestion(0);
                toast.success('Interview questions loaded!');
            }
        } catch (error) {
            console.error('Interview prep error:', error);
            toast.error(error.response?.data?.message || 'Failed to generate interview prep');
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs sm:text-sm font-semibold py-2 px-4 shadow-xs"
                >
                    <Award className="w-4 h-4 text-indigo-600" />
                    Interview Prep
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            AI Interview Coach & Questions
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-500 text-sm">
                        Practice expected interview questions and winning answer strategies tailored for <strong className="text-gray-700">{jobTitle}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-2">
                    {!prepData ? (
                        <div className="text-center py-8 px-4 bg-indigo-50/40 rounded-xl border border-dashed border-indigo-200">
                            <Sparkles className="w-10 h-10 text-indigo-500 mx-auto mb-3 animate-pulse" />
                            <h4 className="font-semibold text-gray-800 text-sm">Generate Custom Interview Questions</h4>
                            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                                Google Gemini analyzes the required tech stack and experience level to formulate real-world technical and situational interview questions.
                            </p>
                            <Button
                                onClick={handleFetchPrep}
                                disabled={loading}
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium px-5 py-2.5 shadow-md inline-flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Preparing Interview Questions...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Generate Practice Questions
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {prepData.roleOverview && (
                                <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                                    <strong className="font-semibold">Interview Focus: </strong>
                                    {prepData.roleOverview}
                                </div>
                            )}

                            <div className="space-y-3">
                                {prepData.questions?.map((q, idx) => {
                                    const isExpanded = expandedQuestion === idx;
                                    return (
                                        <div
                                            key={idx}
                                            className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 bg-white shadow-xs"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleQuestion(idx)}
                                                className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{q.question}</p>
                                                        {q.category && (
                                                            <Badge variant="secondary" className="mt-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5">
                                                                {q.category}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-gray-400">
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </span>
                                            </button>

                                            {isExpanded && (
                                                <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50/50 space-y-3 text-xs leading-relaxed animate-in fade-in duration-200">
                                                    {q.whyAsked && (
                                                        <div>
                                                            <span className="font-semibold text-gray-700">Why Interviewers Ask This: </span>
                                                            <span className="text-gray-600">{q.whyAsked}</span>
                                                        </div>
                                                    )}

                                                    {q.sampleAnswer && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                            <span className="font-semibold text-indigo-700 block mb-1">Answer Strategy / Key Points:</span>
                                                            <p className="text-gray-700 whitespace-pre-line">{q.sampleAnswer}</p>
                                                        </div>
                                                    )}

                                                    {q.keyTips && (
                                                        <div className="text-amber-800 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/80">
                                                            <strong className="font-semibold">Pro Tip: </strong>
                                                            {q.keyTips}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex sm:justify-between items-center gap-2">
                    {prepData && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleFetchPrep}
                            disabled={loading}
                            className="text-xs rounded-xl"
                        >
                            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Regenerate Questions'}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="rounded-xl text-gray-600 ml-auto"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AiInterviewPrepModal;
