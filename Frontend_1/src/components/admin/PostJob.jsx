import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import axios from 'axios';
import { JOB_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';


const companyArray = [];
const PostJob = () => {
  const [input, setInput] = useState({
    title: '',
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    exprience: "",
    position: 0,
    companyId: ""

  });
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { companies } = useSelector(store => store.company)
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  };
  //here we get the select box value
  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find((company) => company.name.toLowerCase() === value)
    setInput({ ...input, companyId: selectedCompany._id })
  }

  const FormSubmit = async (e) => {
    e.preventDefault()
  
    
    try {
      setLoading(true)
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs")
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }


  }
  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center w-screen my-5'>
        <form onSubmit={FormSubmit} className='p-8 max-w-4xl border border-gray-200 shadow-xl rounded-xl'>


          <div className='grid grid-cols-2 gap-2'>

            <div>
              <Label>Title</Label>
              <input type="text"
                name='title'
                value={input.title}
                onChange={changeEventHandler}
                className="w-full p-2 border border-gray-400 rounded-lg" />
            </div>
            <div>
              <Label>Description</Label>
              <input type="text"
                name='description'
                value={input.description}
                onChange={changeEventHandler}
                className="w-full p-2 border border-gray-400 rounded-lg" />
            </div>
            <div>
              <Label>Requirements</Label>
              <input type="text"
                name='requirements'
                value={input.requirements}
                onChange={changeEventHandler}
                className="w-full p-2 border border-gray-400 rounded-lg" />
            </div>
            <div>
              <Label>Salary</Label>
              <input type="text"
                name='salary'
                value={input.salary}
                onChange={changeEventHandler}
                className="w-full p-2 border border-gray-400 rounded-lg" />
            </div>
            <div>
              <Label>Location</Label>
              <input type="text"
                name='location'
                value={input.location}
                onChange={changeEventHandler}
                className="w-full p-2 border border-gray-400 rounded-lg" />
            </div>
            <div>
              <Label>Job Type</Label>
              <input type="text"
                name='jobType'
                value={input.jobType}
                onChange={changeEventHandler}
                className="w-full p-2 border border-gray-400 rounded-lg" />
            </div>
            <div>
              <Label>Experience Level</Label>
              <input type="text"
                name='exprience'
                value={input.exprience}
                onChange={changeEventHandler}
                className="w-full p-2 border border-gray-400 rounded-lg" />
            </div>
            <div>
              <Label>No of Position</Label>
              <input type="number"
                name='position'
                value={input.position}
                onChange={changeEventHandler}
                className="w-full p-2 border border-gray-400 rounded-lg" />
            </div>
            {
              companies.length > 0 && (


                <Select onValueChange={selectChangeHandler} >
                  <SelectTrigger className="w-[180px] border-black  rounded-xl ">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className='bg-white'>
                      {
                        companies.map((company) => {
                          return (
                            <SelectItem key={company?._id} value={company?.name?.toLowerCase()} className="cursor-pointer">{company?.name}</SelectItem>
                          )
                        })
                      }


                    </SelectGroup>
                  </SelectContent>
                </Select>

              )
            }
          </div>
          {
            loading ? <button className='w-full bg-[#001f3f] hover:bg-[#001633] text-white font-bold py-2 px-4 rounded'><Loader2 className='mr-2 h-4 w-4 animate-spin' />please wait</button>
              : <Button type="submit" className=" mt-5 px-4 py-2 w-full bg-black text-white rounded-xl hover:bg-gray-900">
                Post New JOb
              </Button>
          }

          {
            companies.length === 0 && <p className='text-xs text-red-600 font-bold text-center my-3'>*please register a company first,before posting a job</p>
          }
        </form>
      </div>
    </div>
  );
}

export default PostJob;
