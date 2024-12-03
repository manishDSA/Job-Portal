import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAllAppliedJob from '@/hooks/useGetAllAppliedJob';


// const skillArray=["java","HTML","CSS","JavaScript","React.js"]
const isResume= true
const Profile = () => {
    //this is custom hook for get the how many jobs applied by the user
    useGetAllAppliedJob();
    const[open,setOpen]= useState(false)
    const {user} = useSelector(store=>store.auth)
    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex justify-between'>

                        <Avatar>
                            <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={()=>setOpen(true)} className="text-right border rounded-xl border-gray-500  hover:bg-gray-500 hover:text-white">
                        <Pen />
                    </Button>
                    {/* <Button className="text-right" variant="outline"><Pen /></Button> */}
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>

                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>

                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>

                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center ga'>

                    {
                    user?.profile?.skills?.length!=0?user?.profile?.skills.map((item,index)=><button key={index} className="rounded-xl bg-black text-white px-4 py-2 m-2 shadow-md">{item}</button>): <span>NA</span>
                    
                    }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        isResume?<a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a>:<span>NA</span>
                    }
                </div>
            </div>
                <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                    <h1 className='font-bold text-lg my-5 '>Applied Jobs</h1>
                    {/* component */}
                     <AppliedJobTable/>
                </div>
                  {/* this is also component */}
                <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    );
}

export default Profile;
