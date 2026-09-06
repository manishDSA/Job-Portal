import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Filter, SlidersHorizontal, X, Briefcase, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { setSearchedQuery } from '@/Redux/jobSlice';

const Jobs = () => {
    // Ensure all jobs are loaded even on direct navigation/refresh
    useGetAllJobs();

    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs || []);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!allJobs) {
            setFilterJobs([]);
            return;
        }

        if (searchedQuery && searchedQuery.trim() !== "") {
            const query = searchedQuery.toLowerCase().trim();

            const filteredJobs = allJobs.filter((job) => {
                const titleMatch = job?.title?.toLowerCase().includes(query);
                const descMatch = job?.description?.toLowerCase().includes(query);
                const locationMatch = job?.location?.toLowerCase().includes(query);
                const jobTypeMatch = job?.jobType?.toLowerCase().includes(query);
                const companyMatch = job?.company?.name?.toLowerCase().includes(query);
                const reqMatch = Array.isArray(job?.requirements)
                    ? job.requirements.some(req => req.toLowerCase().includes(query))
                    : false;

                // Handle salary ranges
                let salaryMatch = false;
                const salaryNum = Number(job?.salary);
                if (query.includes("0 - 5 lpa") || query.includes("0-5")) {
                    salaryMatch = salaryNum <= 5;
                } else if (query.includes("5 - 10 lpa") || query.includes("5-10")) {
                    salaryMatch = salaryNum > 5 && salaryNum <= 10;
                } else if (query.includes("10 - 20 lpa") || query.includes("10-20")) {
                    salaryMatch = salaryNum > 10 && salaryNum <= 20;
                } else if (query.includes("20+ lpa") || query.includes("20+")) {
                    salaryMatch = salaryNum > 20;
                } else if (!isNaN(query)) {
                    salaryMatch = salaryNum === Number(query);
                } else {
                    salaryMatch = String(job?.salary).includes(query);
                }

                return titleMatch || descMatch || locationMatch || jobTypeMatch || companyMatch || reqMatch || salaryMatch;
            });

            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col'>
            <Navbar />
            
            <main className='flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                {/* Header & Mobile Filter Bar */}
                <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
                    <div>
                        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Explore Jobs</h1>
                        <p className='text-sm text-gray-500 mt-1'>
                            Showing <span className='font-semibold text-gray-800'>{filterJobs?.length || 0}</span> {filterJobs?.length === 1 ? 'job' : 'jobs'}
                            {searchedQuery && (
                                <span> for "<span className='text-[#6A38C2] font-semibold'>{searchedQuery}</span>"</span>
                            )}
                        </p>
                    </div>

                    {/* Mobile filter button */}
                    <div className='flex items-center gap-2 lg:hidden'>
                        {searchedQuery && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => dispatch(setSearchedQuery(''))}
                                className='rounded-xl text-xs flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50'
                            >
                                <RotateCcw className='w-3.5 h-3.5' />
                                Clear Filter
                            </Button>
                        )}
                        <Button
                            onClick={() => setShowMobileFilter(!showMobileFilter)}
                            className='bg-[#6A38C2] hover:bg-[#5b30a6] text-white flex items-center gap-2 rounded-xl text-sm'
                        >
                            <SlidersHorizontal className='w-4 h-4' />
                            {showMobileFilter ? 'Hide Filters' : 'Filters'}
                            {searchedQuery && (
                                <span className='w-2 h-2 rounded-full bg-white animate-pulse' />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Filter Drawer / Collapse */}
                <AnimatePresence>
                    {showMobileFilter && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className='lg:hidden mb-6 overflow-hidden'
                        >
                            <FilterCard />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Layout */}
                <div className='flex flex-col lg:flex-row gap-6 items-start'>
                    {/* Desktop Sidebar Filter */}
                    <aside className='hidden lg:block w-72 flex-shrink-0 sticky top-24'>
                        <FilterCard />
                    </aside>

                    {/* Jobs Grid / Empty State */}
                    <div className='flex-1 w-full'>
                        {filterJobs?.length <= 0 ? (
                            <div className='bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm flex flex-col items-center justify-center my-6'>
                                <div className='w-16 h-16 bg-purple-50 text-[#6A38C2] rounded-full flex items-center justify-center mb-4'>
                                    <Briefcase className='w-8 h-8' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-900 mb-1'>No Jobs Found</h3>
                                <p className='text-sm text-gray-500 max-w-sm mb-5'>
                                    {searchedQuery
                                        ? `We couldn't find any job openings matching "${searchedQuery}". Try selecting different filters or keywords.`
                                        : "There are currently no job openings available. Please check back later!"}
                                </p>
                                {searchedQuery && (
                                    <Button
                                        onClick={() => dispatch(setSearchedQuery(''))}
                                        className='bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl'
                                    >
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className='lg:max-h-[calc(100vh-170px)] lg:overflow-y-auto lg:pr-2'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-6'>
                                    <AnimatePresence>
                                        {filterJobs?.map((job) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.25 }}
                                                key={job?._id}
                                            >
                                                <Job job={job} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Jobs;
