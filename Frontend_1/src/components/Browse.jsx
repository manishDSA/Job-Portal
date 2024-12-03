import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/Redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const randomJobs =[1,2,3,5]
const Browse = () => {
  //here we use custom hook to get the jobs on base on the key word
  useGetAllJobs();
  
  const {allJobs} = useSelector(store=>store.job)
  const dispatch = useDispatch();
  //here after the search in hero section clean the search data
  useEffect(()=>{
    return()=>{
      dispatch(setSearchedQuery(""))
    }
  },[])
  return (
    <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results({allJobs.length})</h1>
                <div className='grid grid-cols-3 gap-4'>
                  {
                    allJobs.map((job)=>(
                      <Job key={job?._id} job={job}/>
                    ))
                  } 
                </div>

            </div>
        </div>
  );
}

export default Browse;
