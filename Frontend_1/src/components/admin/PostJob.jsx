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
import { Loader2, Sparkles, Building2 } from 'lucide-react';
import AiJobGeneratorDialog from './AiJobGeneratorDialog';

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { companies } = useSelector(store => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany.id || selectedCompany._id });
    }
  };

  const handleApplyAiData = (aiData) => {
    setInput((prev) => ({
      ...prev,
      ...aiData,
    }));
  };

  const FormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className='flex-1 flex items-center justify-center p-4 my-6'>
        <form onSubmit={FormSubmit} className='p-8 max-w-4xl w-full bg-white border border-gray-200 shadow-xl rounded-2xl'>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Post New Job Opportunity</h1>
              <p className="text-sm text-gray-500">Fill in the details below or use AI to draft in seconds.</p>
            </div>
            
            {/* AI Generator Dialog Trigger */}
            <AiJobGeneratorDialog currentValues={input} onApplyGeneratedData={handleApplyAiData} />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Job Title</Label>
              <input
                type="text"
                name='title'
                value={input.title}
                onChange={changeEventHandler}
                placeholder="e.g. Full Stack Developer"
                className="w-full mt-1.5 p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Experience Level (Years)</Label>
              <input
                type="number"
                name='exprience'
                value={input.exprience}
                onChange={changeEventHandler}
                placeholder="e.g. 2"
                className="w-full mt-1.5 p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700">Job Description</Label>
                <span className="text-xs text-purple-600 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-fillable with AI
                </span>
              </div>
              <textarea
                name='description'
                rows={4}
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Describe role, expectations, and day-to-day work..."
                className="w-full mt-1.5 p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="text-sm font-semibold text-gray-700">Requirements & Skills (comma separated)</Label>
              <input
                type="text"
                name='requirements'
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="e.g. React.js, Node.js, PostgreSQL, Tailwind CSS"
                className="w-full mt-1.5 p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Salary (in LPA)</Label>
              <input
                type="number"
                name='salary'
                value={input.salary}
                onChange={changeEventHandler}
                placeholder="e.g. 12"
                className="w-full mt-1.5 p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Location</Label>
              <input
                type="text"
                name='location'
                value={input.location}
                onChange={changeEventHandler}
                placeholder="e.g. Remote / Bangalore"
                className="w-full mt-1.5 p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Job Type</Label>
              <input
                type="text"
                name='jobType'
                value={input.jobType}
                onChange={changeEventHandler}
                placeholder="e.g. Full-time / Part-time / Remote"
                className="w-full mt-1.5 p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">No. of Positions</Label>
              <input
                type="number"
                name='position'
                value={input.position}
                onChange={changeEventHandler}
                placeholder="e.g. 2"
                className="w-full mt-1.5 p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="text-sm font-semibold text-gray-700 block mb-1.5">Select Company</Label>
              {companies?.length > 0 ? (
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full sm:w-[260px] border-gray-300 rounded-xl">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company?.id || company?._id}
                          value={company?.name?.toLowerCase()}
                          className="cursor-pointer"
                        >
                          {company?.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className='text-xs text-red-600 font-medium'>* Please register a company first before posting a job</p>
              )}
            </div>

          </div>

          <div className="mt-8">
            {loading ? (
              <Button disabled className='w-full bg-[#001f3f] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2'>
                <Loader2 className='w-4 h-4 animate-spin' /> Posting Job...
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={companies?.length === 0}
                className="w-full bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:opacity-95 text-white font-medium py-3 rounded-xl shadow-md"
              >
                Post Job
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
