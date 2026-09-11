import React from 'react';
import { Button } from './ui/button';
import { Bookmark, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
    const navigate = useNavigate();

    // calculate days ago
    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return "Recently";
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDiff = currentTime - createdAt;
        const days = Math.floor(timeDiff / (1000 * 24 * 60 * 60));
        if (days === 0) return "Today";
        if (days === 1) return "1 day ago";
        return `${days} days ago`;
    };

    const companyInitials = job?.company?.name
        ? job.company.name.slice(0, 2).toUpperCase()
        : 'CO';

    return (
        <div className='p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full'>
            <div>
                {/* Header: Posted Time & Bookmark */}
                <div className='flex items-center justify-between text-xs text-gray-500 mb-3'>
                    <span className='font-medium bg-gray-100 px-2.5 py-1 rounded-full'>
                        {daysAgoFunction(job?.createdAt)}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-8 h-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    >
                        <Bookmark className='w-4 h-4' />
                    </Button>
                </div>

                {/* Company Info */}
                <div className='flex items-center gap-3 my-2'>
                    <Avatar className='w-12 h-12 rounded-xl border border-gray-100 shadow-sm'>
                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} className='object-cover' />
                        <AvatarFallback className='bg-indigo-100 text-indigo-700 font-bold rounded-xl text-sm'>
                            {companyInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                        <h2 className='font-semibold text-base text-gray-900 truncate'>{job?.company?.name || "Company"}</h2>
                        <p className='text-xs text-gray-500 flex items-center gap-1 mt-0.5'>
                            <MapPin className='w-3 h-3 text-gray-400' />
                            <span className='truncate'>{job?.location || "India"}</span>
                        </p>
                    </div>
                </div>

                {/* Job Title & Description */}
                <div className='my-3'>
                    <h3 className='font-bold text-lg text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors cursor-pointer' onClick={() => navigate(`/description/${job?._id}`)}>
                        {job?.title}
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1 leading-relaxed'>
                        {job?.description}
                    </p>
                </div>

                {/* Badges */}
                <div className='flex flex-wrap items-center gap-1.5 mt-3'>
                    <Badge className='text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold text-xs border border-blue-100'>
                        {job?.position || 1} {job?.position === 1 ? 'Position' : 'Positions'}
                    </Badge>
                    <Badge className='text-[#F83002] bg-orange-50 hover:bg-orange-100 font-semibold text-xs border border-orange-100'>
                        {job?.jobType || 'Full Time'}
                    </Badge>
                    <Badge className='text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold text-xs border border-indigo-100'>
                        {job?.salary} LPA
                    </Badge>
                </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2 sm:gap-3 mt-5 pt-4 border-t border-gray-100'>
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)}
                    variant="outline"
                    className="flex-1 rounded-xl text-xs sm:text-sm font-medium border-gray-300 hover:bg-gray-50 hover:text-black"
                >
                    Details
                </Button>
                <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-xs"
                >
                    Save For Later
                </Button>
            </div>
        </div>
    );
};

export default Job;
