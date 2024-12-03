import express from 'express'

import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAdminjobs, getAllJobs, getjobById, postJob } from '../controllers/jobControllers.js';



const JobRouter= express.Router();
JobRouter.route("/post").post(isAuthenticated,postJob)
JobRouter.route("/get").get(isAuthenticated,getAllJobs)
JobRouter.route("/getadminjobs").get(isAuthenticated,getAdminjobs)
JobRouter.route("/get/:id").get(isAuthenticated,getjobById)


export default JobRouter