import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT, AI_API_END_POINT } from './utils/constant';
import { setUser } from '@/Redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const [parsingLoading, setParsingLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills ? user.profile.skills.join(", ") : "",
        file: null,
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // Parse resume with Gemini AI and auto-fill details
    const parseResumeWithAI = async (selectedFile) => {
        const fileToParse = selectedFile || input.file;
        if (!fileToParse) {
            toast.error("Please select a resume file first");
            return;
        }

        try {
            setParsingLoading(true);
            const formData = new FormData();
            formData.append("file", fileToParse);

            const res = await axios.post(`${AI_API_END_POINT}/parse-resume`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                const extracted = res.data.data;
                setInput((prev) => ({
                    ...prev,
                    fullname: extracted.fullname || prev.fullname,
                    email: extracted.email || prev.email,
                    phoneNumber: extracted.phoneNumber || prev.phoneNumber,
                    bio: extracted.bio || prev.bio,
                    skills: Array.isArray(extracted.skills)
                        ? extracted.skills.join(", ")
                        : extracted.skills || prev.skills,
                }));
                toast.success("Profile details extracted from resume with AI!");
            }
        } catch (error) {
            console.error("Resume parsing error:", error);
            toast.error(error.response?.data?.message || "Failed to auto-parse resume with AI");
        } finally {
            setParsingLoading(false);
        }
    };

    // When file changes, store it and optionally auto-fill
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            // Automatically offer to parse with AI
            parseResumeWithAI(file);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('bio', input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append('file', input.file);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': "multipart/form-data"
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-white sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl p-6" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
                        <span>Update Profile</span>
                        {parsingLoading && (
                            <span className="text-xs text-purple-600 font-normal flex items-center gap-1.5 animate-pulse">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI parsing resume...
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submitHandler} className="space-y-4 my-2">
                    {/* Resume Upload & AI Auto-fill trigger */}
                    <div className="p-3.5 bg-gradient-to-br from-purple-50 via-indigo-50 to-white rounded-xl border border-purple-100 space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="file" className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-[#6A38C2]" />
                                Upload Resume Document
                            </Label>
                            {input.file && !parsingLoading && (
                                <button
                                    type="button"
                                    onClick={() => parseResumeWithAI()}
                                    className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 underline"
                                >
                                    <Sparkles className="w-3 h-3" /> Re-parse with AI
                                </button>
                            )}
                        </div>
                        <Input
                            id="file"
                            name="file"
                            type="file"
                            accept="application/pdf,image/*,.doc,.docx"
                            onChange={fileChangeHandler}
                            className="bg-white border-purple-200 text-xs rounded-xl cursor-pointer"
                        />
                        <p className="text-[11px] text-gray-500">
                            💡 Upload your PDF resume and Gemini AI will automatically extract your name, bio, and skills!
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="fullname" className="text-xs font-semibold text-gray-700">Full Name</Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                type="text"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                placeholder="Your full name"
                                className="mt-1 text-xs rounded-xl"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    placeholder="your@email.com"
                                    className="mt-1 text-xs rounded-xl"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phoneNumber" className="text-xs font-semibold text-gray-700">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    placeholder="Phone number"
                                    className="mt-1 text-xs rounded-xl"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="bio" className="text-xs font-semibold text-gray-700">Bio / Professional Summary</Label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={3}
                                value={input.bio}
                                onChange={changeEventHandler}
                                placeholder="Short professional summary..."
                                className="w-full mt-1 p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed"
                            />
                        </div>

                        <div>
                            <Label htmlFor="skills" className="text-xs font-semibold text-gray-700">Skills (comma separated)</Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={input.skills}
                                onChange={changeEventHandler}
                                placeholder="e.g. React.js, Node.js, PostgreSQL, Tailwind CSS"
                                className="mt-1 text-xs rounded-xl"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        {loading ? (
                            <Button disabled className="w-full bg-[#6A38C2] text-white rounded-xl text-xs font-semibold py-2.5">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Saving Profile...
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl text-xs font-semibold py-2.5 shadow-md"
                            >
                                Save & Update Profile
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
