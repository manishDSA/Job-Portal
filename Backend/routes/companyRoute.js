import express from 'express'

import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getCompany, getCompanyById, registerCompany, updateCompany } from '../controllers/companyControllers.js';
import { singleUpload } from '../middlewares/multer.js';

const companyRouter= express.Router();
companyRouter.route("/register").post(isAuthenticated, registerCompany);
companyRouter.route("/get").get( isAuthenticated,getCompany);
companyRouter.route("/get/:id").get(isAuthenticated,getCompanyById);
companyRouter.route("/update/:id").put(isAuthenticated ,singleUpload, updateCompany);

export default companyRouter