import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { setUser } from '@/Redux/authSlice';



const Navbar = () => {
    //  const user = true
    const { user } = useSelector(store => store.auth)
    //dispatch here
    const dispatch = useDispatch();
    const navigate = useNavigate()
    //Logout api
    const logouthandler = async () => {
        try {
            const res = axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if ((await res).data.success) {
                dispatch(setUser(null));
                navigate('/')
                toast.success((await res).data.message)
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
    return (
        <div className='bg-white'>
            <div className=' flex items-center justify-between mx-auto max-w-7xl h-16'>

                <div>

                    <h1 className='text-2xl font-bold'>Job <span className='text-[#F83002]'>portal</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>

                                    <li><Link to='/admin/companies'>Companies</Link></li>
                                    <li><Link to='/admin/jobs'>Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to='/'>Home</Link></li>
                                    <li><Link to='/jobs'>Jobs</Link></li>
                                    <li><Link to='/browse'>Browser</Link></li>
                                </>
                            )
                        }

                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2 '>
                                <Link to='/login'><Button className='hover: bg-[#e7e5ea] rounded-xl' variant="outline">Login</Button></Link>
                                <Link to='/signup'> <Button className='bg-[#6A38C2] hover:bg-[#38098a] rounded-xl'>SignUp</Button></Link>


                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className='cursor-pointer'>
                                        <AvatarImage src={user?.profile?.profilephoto} alt="@shadcn" />

                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className=' flex gap-4 space-y-2'>
                                        <Avatar className='cursor-pointer'>
                                            <AvatarImage src={user?.profile?.profilephoto} alt="@shadcn" />
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium'>{user.fullname}</h4>
                                            <p className='text-sm text-muted-foreground'>{user.profile.bio}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col my-2 text-gray-600'>
                                        {
                                            user && user.role === 'student' && (
                                                <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                    <User2 />
                                                    <Button variant="link"> <Link to='/profile'>view Profile</Link></Button>
                                                </div>
                                            )
                                        }

                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                            <LogOut />
                                            <Button onClick={logouthandler} variant="link">Logout</Button>
                                        </div>

                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>
        </div>
    );
}

export default Navbar;
