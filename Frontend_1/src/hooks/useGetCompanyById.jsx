import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/components/utils/constant';
import { setSingleCompany } from '@/Redux/companySlice';
import { setAllJobs } from '@/Redux/jobSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchSingleCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{withCredentials:true});
               
                
                if(res.data.success){
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleCompany();
    },[companyId,dispatch])
}

export default useGetCompanyById