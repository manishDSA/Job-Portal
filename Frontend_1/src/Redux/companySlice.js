// import { createSlice } from "@reduxjs/toolkit";

// const companySlice = createSlice({
//     name: "company",
//     initialState: {
//         singleCompany:null,
//     },
//     reducers:{
//         //actions
//         setsingleCompany:(state,action)=>{
//             state.singleCompany= action.payload;

//         }
//     }
// });

// export const {setsingleCompany} = companySlice.actions
// export default companySlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name:"company",
    initialState:{
        singleCompany:null,
        companies:[],
        searchCompanyByText:"",
    },
    reducers:{
        // actions
        setSingleCompany:(state,action) => {
            state.singleCompany = action.payload;
        },

        setCompanies:(state,action)=>{

            state.companies =action.payload
        },
        setsearchCompanyByText:(state,action)=>{
            state.searchCompanyByText=action.payload
        }
       
    }
});
export const {setSingleCompany,setCompanies,setsearchCompanyByText} = companySlice.actions;
export default companySlice.reducer;
