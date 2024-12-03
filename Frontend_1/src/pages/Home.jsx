import CategoryCarousel from '@/components/CategoryCarousel';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import LateastJob from '@/components/LateastJob';
import LateastJobCard from '@/components/LateastJobCard';
import Navbar from '@/components/shared/Navbar';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  //here we get the job from data base on the home page
  useGetAllJobs()
  const {user}= useSelector(store=>store.auth)
  const navigate = useNavigate()
  useEffect(()=>{
 if(user?.role=="recruiter"){
  navigate('/admin/companies')
 }
  },[])
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <CategoryCarousel/>
      <LateastJob/>
      <Footer/>
    </div>
  );
}

export default Home;
