import React from 'react';
import LateastJobCard from './LateastJobCard';
import { useSelector } from 'react-redux';

const LateastJob = () => {
  const { allJobs } = useSelector(store => store.job);
  
  return (
    <div className='max-w-7xl mx-auto my-16 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-3xl sm:text-4xl font-bold'>
        <span className='text-indigo-600'>Latest & Top </span> Job Openings
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-6'>
        {allJobs?.length <= 0 ? (
          <span className='text-gray-500'>No jobs available currently</span>
        ) : (
          allJobs?.slice(0, 6).map((job) => <LateastJobCard key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LateastJob;
