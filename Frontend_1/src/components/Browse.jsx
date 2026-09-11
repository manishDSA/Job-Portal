import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/Redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Browse = () => {
  useGetAllJobs();
  
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <Navbar />
      <main className='flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-6'>
          <h1 className='font-bold text-2xl sm:text-3xl text-gray-900'>
            Search Results ({allJobs?.length || 0})
          </h1>
          {searchedQuery && (
            <p className='text-sm text-gray-500 mt-1'>
              Showing results for "<span className='text-indigo-600 font-semibold'>{searchedQuery}</span>"
            </p>
          )}
        </div>

        {allJobs?.length <= 0 ? (
          <div className='bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm flex flex-col items-center justify-center my-6'>
            <div className='w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4'>
              <Briefcase className='w-8 h-8' />
            </div>
            <h3 className='text-lg font-bold text-gray-900 mb-1'>No Jobs Found</h3>
            <p className='text-sm text-gray-500 max-w-sm'>
              {searchedQuery
                ? `No jobs matched "${searchedQuery}". Try searching with different keywords.`
                : "No job postings available at the moment."}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-10'>
            {allJobs.map((job) => (
              <motion.div
                key={job?._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Job job={job} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Browse;
