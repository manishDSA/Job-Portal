import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/Redux/jobSlice';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchHandler = () => {
        if (!query.trim()) return;
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchHandler();
        }
    };

    return (
        <div className='text-center px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col gap-5 my-10 max-w-4xl mx-auto'>
                <span className='mx-auto px-4 py-1.5 rounded-full bg-orange-50 text-[#F83002] font-semibold text-xs sm:text-sm border border-orange-100'>
                    No. 1 Job Hunt Website
                </span>
                <h1 className='text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight'>
                    Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span>
                </h1>
                <p className='text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed'>
                    Explore thousands of job opportunities across top companies. Find the role that fits your career goals and skill set.
                </p>
                <div className='flex w-full sm:w-[85%] md:w-[70%] lg:w-[60%] max-w-xl shadow-lg border border-gray-200 pl-4 py-1 pr-1.5 rounded-full items-center gap-2 mx-auto bg-white mt-3'>
                    <input
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        type="text"
                        placeholder='Find your dream jobs by title, skill, or location...'
                        className='outline-none border-none w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent'
                    />
                    <Button
                        onClick={searchHandler}
                        className="rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white p-2.5 sm:px-4 flex items-center gap-1 shrink-0"
                    >
                        <Search className='h-4 w-4 sm:h-5 sm:w-5' />
                        <span className='hidden sm:inline text-xs font-medium'>Search</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
