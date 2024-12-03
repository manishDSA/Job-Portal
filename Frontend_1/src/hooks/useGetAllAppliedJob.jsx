import { Application_API_END_POINT } from "@/components/utils/constant";
import { setAllAppliedJobs } from "@/Redux/jobSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";



const useGetAllAppliedJob =  () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllpiedJobs = async () => {
            try {
                const res = await axios.get(`${Application_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {

                    dispatch(setAllAppliedJobs(res.data.application))
                }
            }
            catch (error) {
                console.log(error);

            }

        }
        fetchAllpiedJobs()
    }, [])
};

export default useGetAllAppliedJob;