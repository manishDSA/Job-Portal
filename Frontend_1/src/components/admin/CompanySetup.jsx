import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '../utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const CompanySetup = () => {
    const params = useParams()
    //custom hook for give the id to edit the company information
    useGetCompanyById(params.id)
    const [input, setInput] = useState({
        name: '',
        description: "",
        website: "",
        location: "",
        file: null
    });
//here we get the info og singlecompany
const {singleCompany}= useSelector(store=>store.company);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }
    const SubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name)
        formData.append("description", input.description)
        formData.append("website", input.website)
        formData.append("location", input.location);

        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true)
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    //because we send the file
                    'Content-Type': 'multipart/from-data'
                },
                withCredentials: true
            })
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies")
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false)
        }


    }
      
    useEffect(() => {
        setInput({
            name: singleCompany?.name ||"",
            description:singleCompany?.description || "",
            website:singleCompany?.website|| "",
            location:singleCompany?.location|| "",
            file:singleCompany?.file || null
        })
    }, [singleCompany])

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={SubmitHandler}>
                    <div className='flex items-center gap-5 p-8'>

                        <Button onClick={() => navigate('/admin/companies')} variant='outline' className="flex items-center gap-2 text-gray-500 font-semibold rounded-xl hover:bg-gray-50">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Company setup</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='mx-10'>
                            <Label>Company Name</Label>
                            <input
                                value={input.name}
                                onChange={changeEventHandler}
                                name='name'
                                type="text"

                                className="w-fit my-2  flex rounded-xl border border-gray-300 hover:border-black focus:outline-none focus:ring-2 focus:ring-black p-2 px-10"

                            />
                        </div>
                        <div className='mx-5' >
                            <Label>Description</Label>
                            <input
                                value={input.description}
                                onChange={changeEventHandler}
                                name='description'
                                type="text"

                                className="w-fit my-2  flex rounded-xl border border-gray-300 hover:border-black focus:outline-none focus:ring-2 focus:ring-black p-2 px-10"

                            />
                        </div>
                        <div className='mx-10'>
                            <Label>Website</Label>
                            <input
                                value={input.website}
                                onChange={changeEventHandler}
                                name='website'
                                type="text"

                                className="w-fit my-2 flex rounded-xl border border-gray-300 hover:border-black focus:outline-none focus:ring-2 focus:ring-black p-2 px-10"

                            />
                        </div>
                        <div className='mx-5'>
                            <Label>Location</Label>
                            <input
                                value={input.location}
                                onChange={changeEventHandler}
                                name='location'
                                type="text"

                                className="w-fit my-2 flex rounded-xl border border-gray-300 hover:border-black focus:outline-none focus:ring-2 focus:ring-black p-2 px-10"

                            />
                        </div>
                        <div className='mx-10 mb-3'>
                            <Label>Logo</Label>
                            <input
                                onChange={changeFileHandler}
                                type="file"
                                accept='image/*'
                                className="w-fit my-2 flex rounded-xl border border-gray-300 hover:border-black focus:outline-none focus:ring-2 focus:ring-black p-2"

                            />
                        </div>

                    </div>
                    <div className='mx-10'>
                        {
                            loading ? <button className='w-full bg-[#001f3f] hover:bg-[#001633] text-white font-bold py-2 px-4 rounded'><Loader2 className='mr-2 h-4 w-4 animate-spin' />please wait</button>
                                : <button type='submit' className="bg-black text-white rounded-xl px-4 py-2 hover:bg-gray-800">
                                    New Company
                                </button>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CompanySetup;
