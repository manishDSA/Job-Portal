import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminJobsTable = () => {
    const navigate = useNavigate();
   
    const {allAdminJobs,SearchJobByText} = useSelector(store=>store.job)
    const[filterAdminJob,setfilterAdminJob] = useState(allAdminJobs)
//filter the jobs
    useEffect(()=>{
const filteredJobs = allAdminJobs.length>=0 &&allAdminJobs.filter((job)=>{
    if(!SearchJobByText){
        return true
    };
    return job?.title?.toLowerCase().includes(SearchJobByText.toLowerCase())|| job?.company?.name.toLowerCase().includes(SearchJobByText.toLowerCase())
});
setfilterAdminJob(filteredJobs)
    },[allAdminJobs,SearchJobByText])


    return (
        <div>
            <Table>
                <TableCaption>A list of your recent posted Jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterAdminJob?.length <= 0 ? <span>You Haven't registered any company yet.</span> : (
                            <>
                                {
                                    filterAdminJob?.map((job) => (
                                        <tr key={job._id}>

                                            {/* <TableCell>
                                                <Avatar>
                                                    <AvatarImage src={company.logo} />

                                                </Avatar>
                                            </TableCell> */}
                                            <TableCell>{job?.company?.name}</TableCell>
                                            <TableCell>{job?.title}</TableCell>

                                            <TableCell>{job?.createdAt?.split("T")[0]}</TableCell>
                                            <TableCell className="text-right">
                                                <Popover>
                                                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                                    <PopoverContent className="w-32">
                                                        <div onClick={()=>navigate(`/admin/companies/${job._id}`)} className='flex items-center gap-2 w-fit'>
                                                            <Edit2 className='w-4 cursor-pointer' />
                                                            <span>Edit</span>
                                                        </div>
                                                        <div onClick={()=>navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer'>
                                                            <Eye className='w-4'/>
                                                            <span>Applicants</span>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>

                                        </tr>


                                    ))
                                }

                            </>
                        )
                    }


                </TableBody>
            </Table>
        </div>
    );
}

export default AdminJobsTable;
