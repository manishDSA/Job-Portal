import { COMPANY_API_END_POINT} from '@/components/utils/constant';
import { setCompanies } from '@/Redux/companySlice';

import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllCompanies = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchAllCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`,{withCredentials:true});
                // console.log(res);
                
                if(res.data.success){
                    dispatch(setCompanies(res.data.companies));
                    
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllCompanies();
    },[]) 
}

export default useGetAllCompanies