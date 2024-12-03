import { JOB_API_END_POINT } from '@/components/utils/constant';
import { setAllJobs } from '@/Redux/jobSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
  const {searchedQuery} = useSelector(store=>store.job)
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                // here we get the job with for browse and also get the all job
                const res = await axios.get(`${JOB_API_END_POINT}/get?Keyword=${searchedQuery}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    },[])
}

export default useGetAllJobs