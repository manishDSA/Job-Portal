import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/Redux/authSlice';
import { Loader2, Mail, Lock, Eye, EyeOff, UserCheck, Briefcase } from 'lucide-react';
import { signInWithSocialProvider } from '@/utils/firebase';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5 mr-3 shrink-0 text-[#1877F2] fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const XIcon = () => (
    <svg className="w-4 h-4 mr-3 shrink-0 fill-current text-gray-900" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleSocialLogin = async (providerName) => {
        if (!input.role) {
            toast.error("Please select a role (Student or Recruiter) before continuing with social login");
            return;
        }

        try {
            dispatch(setLoading(true));
            const socialUserData = await signInWithSocialProvider(providerName);
            
            const res = await axios.post(`${USER_API_END_POINT}/social-login`, {
                ...socialUserData,
                role: input.role
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Social auth error:", error);
            toast.error(error.response?.data?.message || `${providerName} authentication failed.`);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.role) {
            toast.error("Please select a role (Student or Recruiter)");
            return;
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='min-h-screen bg-slate-50/70 flex flex-col justify-between'>
            <Navbar />
            <div className='flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 flex-1'>
                <div className='w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6'>
                    {/* Header */}
                    <div className='text-center space-y-1.5'>
                        <h1 className='font-bold text-2xl sm:text-3xl text-gray-900 tracking-tight'>Welcome Back</h1>
                        <p className='text-sm text-gray-500'>Sign in to access your Job Portal account</p>
                    </div>

                    {/* Role Selection */}
                    <div className='space-y-2'>
                        <Label className='text-sm font-medium text-gray-700 block'>Select Role</Label>
                        <div className='grid grid-cols-2 gap-3'>
                            <button
                                type='button'
                                onClick={() => setInput({ ...input, role: 'student' })}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium cursor-pointer ${
                                    input.role === 'student'
                                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-600/20 shadow-xs'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <UserCheck className='w-4 h-4' />
                                <span>Student</span>
                            </button>
                            <button
                                type='button'
                                onClick={() => setInput({ ...input, role: 'recruiter' })}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium cursor-pointer ${
                                    input.role === 'recruiter'
                                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-600/20 shadow-xs'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Briefcase className='w-4 h-4' />
                                <span>Recruiter</span>
                            </button>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className='space-y-2.5 pt-1'>
                        <button
                            type='button'
                            disabled={loading}
                            onClick={() => handleSocialLogin('Google')}
                            className='w-full h-11 flex items-center justify-center border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50'
                        >
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </button>
                        <button
                            type='button'
                            disabled={loading}
                            onClick={() => handleSocialLogin('Facebook')}
                            className='w-full h-11 flex items-center justify-center border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50'
                        >
                            <FacebookIcon />
                            <span>Continue with Facebook</span>
                        </button>
                        <button
                            type='button'
                            disabled={loading}
                            onClick={() => handleSocialLogin('X (Twitter)')}
                            className='w-full h-11 flex items-center justify-center border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50'
                        >
                            <XIcon />
                            <span>Continue with X (Twitter)</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className='relative flex items-center justify-center my-4'>
                        <div className='border-t border-gray-200 w-full'></div>
                        <span className='bg-white px-3 text-xs text-gray-400 uppercase tracking-wider font-medium absolute'>
                            Or continue with email
                        </span>
                    </div>

                    {/* Form */}
                    <form onSubmit={submitHandler} className='space-y-4'>
                        {/* Email Input */}
                        <div className='space-y-1.5'>
                            <Label className='text-sm font-medium text-gray-700'>Email Address</Label>
                            <div className='relative'>
                                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    name="email"
                                    required
                                    className='pl-10 rounded-xl h-11 border-gray-200 focus-visible:ring-indigo-600 transition-all'
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className='space-y-1.5'>
                            <Label className='text-sm font-medium text-gray-700'>Password</Label>
                            <div className='relative'>
                                <Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    name="password"
                                    required
                                    className='pl-10 pr-10 rounded-xl h-11 border-gray-200 focus-visible:ring-indigo-600 transition-all'
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors'
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='pt-2'>
                            {loading ? (
                                <Button disabled className='w-full h-11 bg-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center opacity-80 cursor-not-allowed'>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait...
                                </Button>
                            ) : (
                                <Button
                                    type='submit'
                                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                                >
                                    Sign In
                                </Button>
                            )}
                        </div>

                        {/* Footer Link */}
                        <div className='text-center pt-3 border-t border-gray-100'>
                            <p className='text-sm text-gray-600'>
                                Don't have an account?{' '}
                                <Link to='/signup' className='font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all'>
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
