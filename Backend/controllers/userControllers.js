import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { formatUser } from "../utils/format.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let profilePhotoUrl = "";
        const file = req.file;
        if (file) {
            const fileUrl = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUrl.content);
            profilePhotoUrl = cloudResponse.secure_url;
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                fullname,
                email,
                phoneNumber: String(phoneNumber),
                password: hashPassword,
                role: role.toLowerCase(),
                profilePhoto: profilePhotoUrl
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            user: formatUser(user),
            success: true
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect password or email.",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password or email.",
                success: false
            });
        }

        if (role.toLowerCase() !== user.role.toLowerCase()) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        const tokenData = {
            userId: user.id
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res
            .status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: `Welcome back ${user.fullname}`,
                user: formatUser(user),
                success: true
            });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        let resumeUrl;
        let resumeOriginalName;
        if (file) {
            const fileUri = getDataUri(file);
            const isPdf = file.mimetype === 'application/pdf' || file.originalname?.toLowerCase().endsWith('.pdf');
            const uploadOptions = {
                folder: "resumes",
                resource_type: isPdf ? "raw" : "auto",
            };
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, uploadOptions);
            resumeUrl = cloudResponse.secure_url;
            resumeOriginalName = file.originalname;
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
        }

        const userId = req.id;
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        const updateData = {};
        if (fullname) updateData.fullname = fullname;
        if (email) updateData.email = email;
        if (phoneNumber) updateData.phoneNumber = String(phoneNumber);
        if (bio !== undefined) updateData.bio = bio;
        if (skillsArray !== undefined) updateData.skills = skillsArray;
        if (resumeUrl) {
            updateData.resume = resumeUrl;
            updateData.resumeOriginalName = resumeOriginalName;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: formatUser(updatedUser),
            success: true
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const socialLogin = async (req, res) => {
    try {
        const { fullname, email, profilePhoto, role, provider } = req.body;
        if (!email || !role) {
            return res.status(400).json({
                message: "Email and role selection are required for social login.",
                success: false
            });
        }

        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);
            user = await prisma.user.create({
                data: {
                    fullname: fullname || email.split('@')[0],
                    email,
                    phoneNumber: "",
                    password: randomPassword,
                    role: role.toLowerCase(),
                    profilePhoto: profilePhoto || ""
                }
            });
        }

        const tokenData = {
            userId: user.id
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY || "jobportal_secret", { expiresIn: '1d' });

        return res
            .status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: `Successfully authenticated via ${provider || 'Social Login'}. Welcome ${user.fullname}!`,
                user: formatUser(user),
                success: true
            });
    } catch (error) {
        console.error("Social Login Error:", error);
        return res.status(500).json({
            message: "Internal server error during social login",
            success: false
        });
    }
};