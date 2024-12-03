
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// here children return those route pass in app.jsx and between the protectedRoute and after
// this check these condition
const ProtectedRoute =({children})=>{
const {user} = useSelector(store=>store.auth);
const navigate = useNavigate();

useEffect(()=>{
if(user=== null ||user.role != 'recruiter'){
 navigate("/");
}
},[])
return (
    <>
    {children}
    </>
)

};
export default ProtectedRoute;