import React from 'react';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const LateastJobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className='p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white border border-gray-100 cursor-pointer flex flex-col justify-between'
    >
      <div>
        <h2 className='font-semibold text-base text-gray-900 truncate'>{job?.company?.name || "Company"}</h2>
        <p className='text-xs text-gray-500 mt-0.5'>{job?.location || "India"}</p>
        
        <h3 className='font-bold text-lg text-gray-900 my-2 line-clamp-1 hover:text-indigo-600 transition-colors'>
          {job?.title}
        </h3>
        <p className='text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed'>
          {job?.description}
        </p>
      </div>

      <div className='flex flex-wrap items-center gap-1.5 mt-4 pt-2 border-t border-gray-50'>
        <Badge className='text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold text-xs border border-blue-100'>
          {job?.position || 1} Positions
        </Badge>
        <Badge className='text-[#F83002] bg-orange-50 hover:bg-orange-100 font-semibold text-xs border border-orange-100'>
          {job?.jobType || 'Full Time'}
        </Badge>
        <Badge className='text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold text-xs border border-indigo-100'>
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LateastJobCard;
