import { createSlice } from "@reduxjs/toolkit";

const  jobSlice = createSlice({
    name: "job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null,
        SearchJobByText:"",
        allAppliedJobs:"",
        searchedQuery:"",
    },
    reducers:{
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setallAdminJobs:(state,action)=>{
            state.allAdminJobs=action.payload
        },
        setSearchJobByText:(state,action)=>{
            state.SearchJobByText=action.payload
        },
        setAllAppliedJobs:(state,action)=>{
            state.allAppliedJobs=action.payload;
        },
        setSearchedQuery: (state,action)=>{
            state.searchedQuery=action.payload;
        }
        
    }
})

export const {setAllJobs,setallAdminJobs,setSearchJobByText,setAllAppliedJobs,setSearchedQuery}= jobSlice.actions;
export const{setSingleJob}= jobSlice.actions;
export default jobSlice.reducer;