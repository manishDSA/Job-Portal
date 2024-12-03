import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setsearchCompanyByText } from '@/Redux/companySlice';

const Companies = () => {
  
    useGetAllCompanies()
    const navigate = useNavigate()
    // here we are filter the job for companies table component
    const [input,setInput] = useState("")
    const dispatch = useDispatch()
    useEffect(()=>{
 dispatch(setsearchCompanyByText(input));
    },[input])
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between'>
                    <input
                        className="w-fit rounded-xl border border-gray-300 hover:border-black focus:outline-none focus:ring-2 focus:ring-black p-2"
                        placeholder="Filter by name"
                        onChange={(e)=>setInput(e.target.value)}
                    />

                    <button onClick={()=>navigate('/admin/compnaies/create')} className="bg-black text-white rounded-xl px-4 py-2 hover:bg-gray-800">
                        New Company
                    </button>


                </div>
                <div>
                <CompaniesTable/>
            </div>
            </div>
           
        </div>
    );
}

export default Companies;
