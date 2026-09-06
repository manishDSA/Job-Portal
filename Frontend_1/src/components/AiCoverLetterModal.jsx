import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Sparkles, Loader2, Copy, Check, FileText } from 'lucide-react';
import axios from 'axios';
import { AI_API_END_POINT } from './utils/constant';
import { toast } from 'sonner';

const AiCoverLetterModal = ({ jobId, jobTitle, companyName, user }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!user) {
            toast.error('Please login to generate a cover letter');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${AI_API_END_POINT}/generate-cover-letter`,
                { jobId },
                { withCredentials: true }
            );

            if (res.data.success) {
                setCoverLetter(res.data.coverLetter);
                toast.success('Cover letter generated!');
            }
        } catch (error) {
            console.error('Cover letter generation error:', error);
            toast.error(error.response?.data?.message || 'Failed to generate cover letter');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!coverLetter) return;
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        toast.success('Cover letter copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 border-purple-200 text-[#6A38C2] hover:bg-purple-50 rounded-xl text-xs sm:text-sm font-semibold py-2 px-4 shadow-xs"
                >
                    <FileText className="w-4 h-4 text-purple-600" />
                    AI Cover Letter
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-xl text-[#6A38C2]">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Tailored AI Cover Letter
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-500 text-sm">
                        Generate a personalized, high-converting pitch for <strong className="text-gray-700">{jobTitle}</strong> at <strong className="text-gray-700">{companyName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-2">
                    {!coverLetter ? (
                        <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <FileText className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-800 text-sm">Ready to generate your cover letter?</h4>
                            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                                Google Gemini will combine your skills, bio, and experience with the requirements of this job to craft an authentic application letter.
                            </p>
                            <Button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="mt-4 bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl text-sm font-medium px-5 py-2.5 shadow-md inline-flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Writing Cover Letter...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Generate Cover Letter
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Editable Draft
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleGenerate}
                                        disabled={loading}
                                        className="text-xs rounded-lg h-8"
                                    >
                                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Regenerate'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleCopy}
                                        className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white text-xs rounded-lg h-8 flex items-center gap-1.5"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copied ? 'Copied!' : 'Copy Letter'}
                                    </Button>
                                </div>
                            </div>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows={12}
                                className="w-full p-4 text-xs sm:text-sm text-gray-800 bg-gray-50/60 border border-gray-200 rounded-xl leading-relaxed focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="rounded-xl text-gray-600"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AiCoverLetterModal;
