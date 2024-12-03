import React from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';


    // const jobid= " kasncdcdbcidbnci"
const Job = ({job}) => {
    const navigate = useNavigate()
// here we calculate the day to appied job
 const daysAgoFunction = (mongodbTime)=>{
   const createdAt = new Date(mongodbTime);
   const currentTime = new Date();
   const timeDiff = currentTime - createdAt;
   return Math.floor(timeDiff/(1000*24*60*60))
 }
    return (
        <div className='p-5  rounded-xl shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>

                <p className='text-sm text-gray-500'> {daysAgoFunction(job?.createdAt)==0?"Today":`${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className=" rounded-full hover:bg-gray-200" size="icon"><Bookmark /></Button>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" size="icon"  >
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={`text-blue-700 font-bold`} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={`text-[#F83002] font-bold`} variant="ghost">{job?.jobType}</Badge>
                <Badge className={`text-[#7209b7] font-bold`} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <button onClick={()=>navigate(`/description/${job._id}`)} className="px-4 py-2 font-semibold  rounded-xl border-2 border-gray-300-500">
                    Details
                </button>
                {/* <button className="px-4 py-2 font-semibold  rounded-xl border-2 border-gray-300-500">
                    
                </button> */}
                <button className=" bg-[#7209b7] px-4 py-2 font-semibold  rounded-xl border-2 text-white border-gray-300-500">Save For Later</button>
            </div>
        </div>
    );
}

export default Job;
