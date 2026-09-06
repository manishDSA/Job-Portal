import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { FileText, ExternalLink, Download, Eye, AlertCircle } from 'lucide-react';

export const formatResumeUrl = (url, originalName = "") => {
    if (!url) return "";
    
    // If it's a Cloudinary image upload (which blocks direct .pdf with 401 ACL failure)
    if (url.includes('cloudinary.com') && url.includes('/image/upload/')) {
        // Strip any trailing .pdf and append .png for high quality image rendering of PDF page
        const cleaned = url.replace(/\.pdf$/i, '');
        return `${cleaned}.png`;
    }
    
    return url;
};

const ResumeViewerModal = ({ resumeUrl, originalName = "Resume.pdf", triggerText, className }) => {
    const [open, setOpen] = useState(false);
    
    if (!resumeUrl) {
        return <span className="text-xs text-gray-400">No resume</span>;
    }

    const displayUrl = formatResumeUrl(resumeUrl, originalName);
    const isRawPdf = resumeUrl.includes('/raw/upload/') || (!resumeUrl.includes('cloudinary.com') && resumeUrl.endsWith('.pdf'));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className={className || "inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 transition-colors"}
                >
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    {triggerText || originalName || "View Resume"}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full h-[88vh] flex flex-col bg-white rounded-2xl p-6">
                <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 pr-6">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-purple-100 rounded-xl text-[#6A38C2]">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-gray-900">
                                {originalName || "Candidate Resume"}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-gray-500">
                                Document Preview & Details
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={displayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open in Tab
                        </a>
                        <a
                            href={displayUrl}
                            download={originalName || "resume.pdf"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl transition-colors shadow-xs"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Download
                        </a>
                    </div>
                </DialogHeader>

                <div className="flex-1 w-full bg-gray-50 rounded-xl overflow-auto mt-3 border border-gray-200 flex items-center justify-center p-4">
                    {isRawPdf ? (
                        <iframe
                            src={displayUrl}
                            title={originalName || "Resume Preview"}
                            className="w-full h-full border-none rounded-xl"
                        />
                    ) : (
                        <img
                            src={displayUrl}
                            alt={originalName || "Resume Document"}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm border border-gray-100"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = resumeUrl;
                            }}
                        />
                    )}
                </div>

                <DialogFooter className="pt-2 flex justify-between items-center">
                    <p className="text-[11px] text-gray-400">
                        Tip: You can re-upload your resume anytime in your Profile settings.
                    </p>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="text-xs rounded-xl text-gray-600"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ResumeViewerModal;
