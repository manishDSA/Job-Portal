import express from 'express'

import isAuthenticated from '../middlewares/isAuthenticated.js';
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from '../controllers/applicationControllers.js';



const appicationRouter= express.Router();

appicationRouter.route("/apply/:id").get(isAuthenticated,applyJob)
appicationRouter.route("/get").get(isAuthenticated,getAppliedJobs)
appicationRouter.route("/:id/applicants").get(isAuthenticated,getApplicants)
appicationRouter.route("/status/:id/update").post(isAuthenticated,updateStatus)


export default appicationRouter