import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Briefcase, FileText } from 'lucide-react';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAllAppliedJob from '@/hooks/useGetAllAppliedJob';
import ResumeViewerModal from './ResumeViewerModal';

const Profile = () => {
    // Custom hook to fetch user's applied jobs
    useGetAllAppliedJob();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const userInitials = user?.fullname
        ? user.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="bg-gray-50/50 min-h-screen pb-12">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                {/* Main Profile Info Card */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-8 shadow-xs">
                    {/* Header: Avatar, Details & Edit Button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                            <Avatar className="h-16 w-16 sm:h-24 sm:w-24 border-2 border-indigo-100 shadow-xs shrink-0">
                                <AvatarImage src={user?.profile?.profilephoto} alt={user?.fullname || "Profile"} />
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-lg sm:text-2xl">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                                <h1 className="font-bold text-lg sm:text-2xl text-gray-900 truncate">
                                    {user?.fullname || "User Name"}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed line-clamp-3">
                                    {user?.profile?.bio || "No professional summary added yet."}
                                </p>
                            </div>
                        </div>

                        <Button 
                            onClick={() => setOpen(true)} 
                            variant="outline"
                            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-slate-100 hover:text-gray-900 rounded-xl text-xs font-semibold px-4 py-2"
                        >
                            <Pen className="w-3.5 h-3.5 text-gray-500" />
                            <span>Edit Profile</span>
                        </Button>
                    </div>

                    {/* Contact Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-6 pt-5 border-t border-gray-100">
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100 text-gray-700 text-xs sm:text-sm">
                            <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="truncate">{user?.email || "No email provided"}</span>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100 text-gray-700 text-xs sm:text-sm">
                            <Contact className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>{user?.phoneNumber || "No phone number added"}</span>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="my-5 pt-4 border-t border-gray-100">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                            Skills & Expertise
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {user?.profile?.skills && user.profile.skills.length > 0 ? (
                                user.profile.skills.map((item, index) => (
                                    <span 
                                        key={index} 
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs hover:bg-slate-200 transition-colors"
                                    >
                                        {item}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400 italic">No skills listed yet. Click edit profile to add skills.</span>
                            )}
                        </div>
                    </div>

                    {/* Resume Document Section */}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Resume Document
                        </h2>
                        {user?.profile?.resume ? (
                            <div className="flex items-center gap-2 mt-1">
                                <ResumeViewerModal
                                    resumeUrl={user?.profile?.resume}
                                    originalName={user?.profile?.resumeOriginalName || "My_Resume.pdf"}
                                    triggerText={user?.profile?.resumeOriginalName || "View Uploaded Resume"}
                                />
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400 italic">No resume uploaded yet. Edit profile to upload document.</span>
                        )}
                    </div>
                </div>

                {/* Applied Jobs Section */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-8 my-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-base sm:text-lg text-gray-900 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                            <span>Applied Jobs</span>
                        </h2>
                    </div>
                    <AppliedJobTable />
                </div>
            </div>

            {/* Edit Profile Modal */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;

