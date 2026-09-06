import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { Application_API_END_POINT } from '../utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/Redux/applicationSlice';

const Applicants = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const { applicants } = useSelector(store => store.application)
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${Application_API_END_POINT}/${params.id}/applicants`, { withCredentials: true })

        dispatch(setAllApplicants(res.data.job))

      }
      catch (error) {
        console.log(error);

      }
    }
    fetchApplicants();
  }, [])
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className="flex items-center justify-between">
          <h1 className='font-bold text-2xl text-gray-900'>Applicants ({applicants?.applications?.length || 0})</h1>
        </div>
        <ApplicantsTable jobId={params.id} />
      </div>
    </div>
  );
};

export default Applicants;
