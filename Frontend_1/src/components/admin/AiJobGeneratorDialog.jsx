import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Sparkles, Loader2, CheckCircle2, Wand2 } from 'lucide-react';
import axios from 'axios';
import { AI_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';

const AiJobGeneratorDialog = ({ currentValues, onApplyGeneratedData }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(currentValues?.title || '');
    const [experience, setExperience] = useState(currentValues?.exprience || '');
    const [location, setLocation] = useState(currentValues?.location || '');
    const [jobType, setJobType] = useState(currentValues?.jobType || 'Full-time');
    const [generatedResult, setGeneratedResult] = useState(null);

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
            setTitle(currentValues?.title || '');
            setExperience(currentValues?.exprience || '');
            setLocation(currentValues?.location || '');
            setJobType(currentValues?.jobType || 'Full-time');
        }
    };

    const handleGenerate = async () => {
        if (!title.trim()) {
            toast.error('Please enter a job title');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${AI_API_END_POINT}/generate-job-description`,
                {
                    title,
                    experienceLevel: experience,
                    location,
                    jobType,
                    companyId: currentValues?.companyId,
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                setGeneratedResult(res.data.data);
                toast.success('AI generation complete!');
            }
        } catch (error) {
            console.error('AI generation error:', error);
            toast.error(error.response?.data?.message || 'Failed to generate with AI');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!generatedResult) return;

        const requirementsString = Array.isArray(generatedResult.requirements)
            ? generatedResult.requirements.join(', ')
            : generatedResult.requirements || '';

        onApplyGeneratedData({
            title: title || currentValues?.title,
            description: generatedResult.description || '',
            requirements: requirementsString,
            position: generatedResult.recommendedPositions || currentValues?.position || 1,
            location: location || currentValues?.location,
            jobType: jobType || currentValues?.jobType,
            exprience: experience || currentValues?.exprience,
        });

        toast.success('AI generated content applied to job form!');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 border-purple-300 text-[#6A38C2] hover:bg-purple-50 hover:text-[#5b30a6] rounded-xl font-medium"
                >
                    <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                    Auto-Generate with AI
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-xl text-[#6A38C2]">
                            <Wand2 className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            AI Job Description & Requirements Generator
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-500 text-sm">
                        Enter key details and Google Gemini AI will draft professional job descriptions, skill requirements, and recommendations.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs font-semibold text-gray-700">Job Title *</Label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Senior Frontend Developer"
                                className="w-full mt-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-gray-700">Experience (Years)</Label>
                            <input
                                type="text"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder="e.g. 2"
                                className="w-full mt-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-gray-700">Location</Label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Remote / Bangalore"
                                className="w-full mt-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-gray-700">Job Type</Label>
                            <input
                                type="text"
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                                placeholder="e.g. Full-time / Internship"
                                className="w-full mt-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={loading || !title}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl py-2.5 font-medium hover:opacity-95 shadow-md flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating with Gemini AI...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Content
                            </>
                        )}
                    </Button>

                    {generatedResult && (
                        <div className="mt-4 p-4 bg-purple-50/50 border border-purple-100 rounded-xl space-y-3 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm text-purple-900 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    AI Draft Preview
                                </h4>
                                {generatedResult.suggestedSalaryRange && (
                                    <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                                        Suggested Salary: {generatedResult.suggestedSalaryRange}
                                    </span>
                                )}
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-700">Generated Description:</p>
                                <p className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto p-2 bg-white rounded-lg border border-gray-200">
                                    {generatedResult.description}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-700">Required Skills & Requirements:</p>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {generatedResult.requirements?.map((req, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs bg-white text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-md font-medium"
                                        >
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-4 flex sm:justify-between items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="rounded-xl text-gray-600"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleApply}
                        disabled={!generatedResult}
                        className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl px-5"
                    >
                        Apply to Job Form
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AiJobGeneratorDialog;
