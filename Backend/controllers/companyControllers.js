import prisma from "../utils/prisma.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { formatCompany } from "../utils/format.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        }

        const existingCompany = await prisma.company.findUnique({
            where: { name: companyName }
        });

        if (existingCompany) {
            return res.status(400).json({
                message: "Company already exists",
                success: false
            });
        }

        const company = await prisma.company.create({
            data: {
                name: companyName,
                userId: req.id
            }
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company: formatCompany(company),
            success: true
        });
    } catch (error) {
        console.error("Register Company Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await prisma.company.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json({
            companies: companies.map(formatCompany),
            success: true
        });
    } catch (error) {
        console.error("Get Company Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await prisma.company.findUnique({
            where: { id: companyId }
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            company: formatCompany(company),
            success: true
        });
    } catch (error) {
        console.error("Get Company By ID Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;

        let logoUrl;
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logoUrl = cloudResponse.secure_url;
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (website !== undefined) updateData.website = website;
        if (location !== undefined) updateData.location = location;
        if (logoUrl) updateData.logo = logoUrl;

        const company = await prisma.company.update({
            where: { id: req.params.id },
            data: updateData
        });

        return res.status(200).json({
            message: "Company information updated.",
            company: formatCompany(company),
            success: true
        });
    } catch (error) {
        console.error("Update Company Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};