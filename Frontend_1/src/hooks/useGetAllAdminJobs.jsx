import { JOB_API_END_POINT } from '@/components/utils/constant';
import { setallAdminJobs, setAllJobs } from '@/Redux/jobSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true});
                console.log(res);
                
                if(res.data.success){
                    dispatch(setallAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);  
            }
        }
        fetchAllAdminJobs();
    },[])
}

export default useGetAllAdminJobs