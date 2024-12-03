import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/Redux/authSlice';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const[input,setInput]= useState({
    
    email:"",
   password:"",
   role:""
  })
  // get the loading in store using useselector
  const {loading,user} = useSelector(store=>store.auth)
const navigate= useNavigate();
//loading on the page when user until user not login
//using redux
const dispatch = useDispatch();
  const changeEventHandler = (e)=>{
    setInput({...input,[e.target.name]:e.target.value});

  }
//handling the file
const submitHandler =async (e)=>{
  e.preventDefault();

  try {
    dispatch(setLoading(true))
  const res = await axios.post(`${USER_API_END_POINT}/login`,input,{
    headers: {
      "Content-Type":"application/json"
    },
    withCredentials:true,
  })
  if(res.data.success){
    dispatch(setUser(res.data.user))
    navigate("/")
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
      <div onSubmit={submitHandler} className='flex items-center justify-center max-w-7xl mx-auto'>
        <form action="" className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
          <h1 className='font-bold text-xl mb-5'>Login</h1>

          <div className='my-2'>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="manish@gmail.com"
              value={input.email}
              onChange={changeEventHandler}
              name="email"
            />
          </div>

          <div className='my-2'>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="password"
              value={input.password}
              onChange={changeEventHandler}
              name="password"
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
                  checked={input.role=="student"}
                  onChange={changeEventHandler}
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  className="cursor-pointer"
                  checked={input.role=="recruiter"}
                  onChange= {changeEventHandler}
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>

            </RadioGroup>

          </div>
          {
           loading? <button className='w-full bg-[#001f3f] hover:bg-[#001633] text-white font-bold py-2 px-4 rounded'><Loader2 className='mr-2 h-4 w-4 animate-spin'/>please wait</button>
           :   <button type='submit' className="w-full bg-[#001f3f] hover:bg-[#001633] text-white font-bold py-2 px-4 rounded">
           Login
         </button>
          }
       
          <span className='text-sm mt-5'>Dont't have an account? <Link to='/signup' className='text-blue-600'>Signup</Link></span>

        </form>
      </div>
    </div>
  );
}

export default Login;
