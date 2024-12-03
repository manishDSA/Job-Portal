import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/Redux/companySlice';


const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>

                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
                </div>
                <Label>Company Name</Label>
                <input
                    type="text"
                    placeholder="JobHunt, Microsoft, etc."
                    className="w-full my-2 flex rounded-xl border border-gray-300 hover:border-black focus:outline-none focus:ring-2 focus:ring-black p-2"
                    onChange={(e)=>setCompanyName(e.target.value)}
                />
                <div class="flex items-center gap-2 my-10">

                    <button onClick={() => navigate('/admin/companies/')} class="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100">
                        Cancel
                    </button>


                    <button onClick={registerNewCompany} class="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-900">
                        Continue
                    </button>
                </div>

            </div>

        </div>
    );
}

export default CompanyCreate;
