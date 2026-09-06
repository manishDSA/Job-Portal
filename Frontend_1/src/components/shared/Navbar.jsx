import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut, User2, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { setUser } from '@/Redux/authSlice';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logouthandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to logout");
        }
    };

    const userInitials = user?.fullname
        ? user.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <header className='bg-white border-b border-gray-100 sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8'>
                {/* Logo */}
                <div>
                    <Link to="/">
                        <h1 className='text-2xl font-bold tracking-tight'>
                            Job <span className='text-[#F83002]'>Portal</span>
                        </h1>
                    </Link>
                </div>

                {/* Desktop Nav Links */}
                <div className='hidden md:flex items-center gap-10'>
                    <ul className='flex font-medium items-center gap-6 text-gray-600'>
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li>
                                    <Link to='/admin/companies' className='hover:text-[#6A38C2] transition-colors'>
                                        Companies
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/admin/jobs' className='hover:text-[#6A38C2] transition-colors'>
                                        Jobs
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to='/' className='hover:text-[#6A38C2] transition-colors'>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/jobs' className='hover:text-[#6A38C2] transition-colors'>
                                        Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/browse' className='hover:text-[#6A38C2] transition-colors'>
                                        Browse
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* User Profile / Auth buttons */}
                    {!user ? (
                        <div className='flex items-center gap-3'>
                            <Link to='/login'>
                                <Button className='rounded-xl hover:bg-gray-100 text-gray-700' variant="outline">
                                    Login
                                </Button>
                            </Link>
                            <Link to='/signup'>
                                <Button className='bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl shadow-sm'>
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className='cursor-pointer w-9 h-9 border border-gray-200 hover:ring-2 hover:ring-[#6A38C2]/40 transition-all'>
                                    <AvatarImage src={user?.profile?.profilephoto} alt={user?.fullname} />
                                    <AvatarFallback className='bg-purple-100 text-[#6A38C2] font-semibold text-xs'>
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className='w-72 p-4 rounded-2xl shadow-xl border border-gray-100'>
                                <div className='flex items-center gap-3 pb-3 border-b border-gray-100'>
                                    <Avatar className='w-11 h-11 border border-gray-100'>
                                        <AvatarImage src={user?.profile?.profilephoto} alt={user?.fullname} />
                                        <AvatarFallback className='bg-purple-100 text-[#6A38C2] font-semibold text-sm'>
                                            {userInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='min-w-0 flex-1'>
                                        <h4 className='font-semibold text-sm text-gray-900 truncate'>{user?.fullname}</h4>
                                        <p className='text-xs text-gray-500 truncate'>{user?.profile?.bio || user?.email}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1 mt-3 text-gray-700 text-sm'>
                                    {user && user.role === 'student' && (
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className='flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors w-full text-left'
                                        >
                                            <User2 className='w-4 h-4 text-gray-500' />
                                            <span>View Profile</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={logouthandler}
                                        className='flex items-center gap-2.5 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors w-full text-left'
                                    >
                                        <LogOut className='w-4 h-4 text-red-500' />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                {/* Mobile Menu Trigger & Avatar */}
                <div className='flex md:hidden items-center gap-3'>
                    {user && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className='cursor-pointer w-8 h-8 border border-gray-200'>
                                    <AvatarImage src={user?.profile?.profilephoto} alt={user?.fullname} />
                                    <AvatarFallback className='bg-purple-100 text-[#6A38C2] font-semibold text-xs'>
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className='w-64 p-3 rounded-2xl'>
                                <div className='flex items-center gap-2 pb-2 border-b border-gray-100'>
                                    <div>
                                        <h4 className='font-medium text-sm'>{user?.fullname}</h4>
                                        <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1 mt-2 text-sm'>
                                    {user && user.role === 'student' && (
                                        <Link to='/profile' className='flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50'>
                                            <User2 className='w-4 h-4' /> View Profile
                                        </Link>
                                    )}
                                    <button
                                        onClick={logouthandler}
                                        className='flex items-center gap-2 p-1.5 rounded-lg hover:bg-red-50 text-red-600 text-left'
                                    >
                                        <LogOut className='w-4 h-4' /> Logout
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className='p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none'
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
                <div className='md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3'>
                    <ul className='space-y-2 font-medium text-gray-700 text-sm'>
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li>
                                    <Link
                                        to='/admin/companies'
                                        onClick={() => setMobileMenuOpen(false)}
                                        className='block py-2 px-3 rounded-lg hover:bg-gray-50'
                                    >
                                        Companies
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/admin/jobs'
                                        onClick={() => setMobileMenuOpen(false)}
                                        className='block py-2 px-3 rounded-lg hover:bg-gray-50'
                                    >
                                        Jobs
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to='/'
                                        onClick={() => setMobileMenuOpen(false)}
                                        className='block py-2 px-3 rounded-lg hover:bg-gray-50'
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/jobs'
                                        onClick={() => setMobileMenuOpen(false)}
                                        className='block py-2 px-3 rounded-lg hover:bg-gray-50'
                                    >
                                        Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/browse'
                                        onClick={() => setMobileMenuOpen(false)}
                                        className='block py-2 px-3 rounded-lg hover:bg-gray-50'
                                    >
                                        Browse
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {!user && (
                        <div className='flex items-center gap-2 pt-3 border-t border-gray-100'>
                            <Link to='/login' className='flex-1' onClick={() => setMobileMenuOpen(false)}>
                                <Button className='w-full rounded-xl' variant="outline">
                                    Login
                                </Button>
                            </Link>
                            <Link to='/signup' className='flex-1' onClick={() => setMobileMenuOpen(false)}>
                                <Button className='w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl'>
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
