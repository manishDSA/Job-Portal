import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/authSlice';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
  const[input,setInput]= useState({
    fullname:"",
    email:"",
    phoneNumber:"",
    password:"",
    role:"",
    file:""
  })
   const {loading,user}= useSelector(state=>state.auth)
  //nevigator
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeEventHandler = (e)=>{
    setInput({...input,[e.target.name]:e.target.value});

  }
//handling the file
const changeFileHandler = (e)=>{
  setInput({...input,file:e.target.files?.[0]})
}
const submitHandler =async (e)=>{
e.preventDefault();
dispatch(setLoading(true))
const formData = new FormData();
formData.append('fullname', input.fullname);
formData.append('email', input.email);
formData.append('phoneNumber', input.phoneNumber);
formData.append('password', input.password);
formData.append('role', input.role);
if (input.file) {
formData.append('file', input.file);
  
}
try {
const res = await axios.post(`${USER_API_END_POINT}/register`,formData,{
  headers: {
    "Content-Type":"multipart/form-data"
  },
  withCredentials:true,
})
if(res.data.success){
  navigate("/login")
toast.success(res.data.message)
}
  
} 
catch (error) {
  console.log(error);
  toast.error(error.response.data.message)
  
}finally{
  dispatch(setLoading(false))
}

}
// this is for protect the route
useEffect(()=>{
  if(user){
    navigate("/")
  }
},[])
  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form onSubmit={submitHandler} action="" className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
          <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
          <div className='my-2 '>
            <Label>Full Name</Label>
            <Input
              type="text"
              placeholder="manish"
              value={input.fullname}
              onChange={changeEventHandler}
              name="fullname"

            />
          </div>
          <div className='my-2'>
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              name="email"
              placeholder="manish@gmail.com"
              
            />
          </div>
          <div className='my-2'>
            <Label>Phone Number</Label>
            <Input
            type="text"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              name="phoneNumber"
              placeholder="number"
            />
          </div>
          <div className='my-2'>
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              onChange={changeEventHandler}
              name="password"
              placeholder="password"
            />
          </div>
          <div className='flex items-center justify-between'>
            <RadioGroup className="flex items-center gap-4 my-5" >
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  className="cursor-pointer"
                  checked={input.role== 'student'}
                  onChange={changeEventHandler}
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role== 'recruiter'}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>

            </RadioGroup>
            <div className='flex items-center gap-2'>
              <Label>Profile</Label>
              <Input
                accept="image/*"
                type="file"
                name="file"
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div>
          </div>
          {
            loading? <button className='w-full bg-[#001f3f] hover:bg-[#001633] text-white font-bold py-2 px-4 rounded'><Loader2 className='mr-2 h-4 w-4 animate-spin'/>please wait</button>
            : <button type='submit' className="w-full bg-[#001f3f] hover:bg-[#001633] text-white font-bold py-2 px-4 rounded">
            Sign Up
          </button>
          }
         
          <span className='text-sm mt-5'>Already have an account? <Link to='/login' className='text-blue-600'>Login</Link></span>

        </form>
      </div>
    </div>
  );
}

export default SignUp;