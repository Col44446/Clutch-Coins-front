const Blog = require("../models/Blog");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";
const SECRET_KEY = "supersecretkey"; // .env me store karna better hoga

// Admin login
exports.loginAdmin = (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ userId: "admin123", role: "admin", email }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({
            success: true,
            role: "admin",
            token,
            message: "Login successful",
            user: {
                _id: "admin123", // unique id
                name: "Admin",
                email: ADMIN_EMAIL,
            },
        });

    } else {
        return res.status(401).json({
            success: false,
            role: "user",
            message: "Invalid credentials"
        });
    }
};

// Create new admin user (only accessible by existing admins)
exports.createAdmin = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                error: "Username and password are required" 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                error: "Password must be at least 6 characters long" 
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ 
                success: false, 
                error: "Admin with this username already exists" 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new admin
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            email: email || null,
            createdBy: req.admin.email, // Track who created this admin
            createdAt: new Date()
        });

        await newAdmin.save();

        // Return admin info without password
        const adminResponse = {
            _id: newAdmin._id,
            username: newAdmin.username,
            email: newAdmin.email,
            createdBy: newAdmin.createdBy,
            createdAt: newAdmin.createdAt
        };

        res.status(201).json({ 
            success: true, 
            message: "Admin user created successfully",
            data: adminResponse 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Server error while creating admin user" 
        });
    }
};

// Get all admin users (only accessible by existing admins)
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}, { password: 0 }); // Exclude password field
        
        // Add the hardcoded admin to the list
        const allAdmins = [
            {
                _id: "admin123",
                username: "admin",
                email: ADMIN_EMAIL,
                createdBy: "system",
                createdAt: new Date("2024-01-01")
            },
            ...admins
        ];

        res.json({ 
            success: true, 
            data: allAdmins 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Server error while fetching admin users" 
        });
    }
};

// Delete admin user (only accessible by existing admins)
exports.deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        // Prevent deletion of hardcoded admin
        if (adminId === "admin123") {
            return res.status(400).json({ 
                success: false, 
                error: "Cannot delete system admin" 
            });
        }

        const deletedAdmin = await Admin.findByIdAndDelete(adminId);
        if (!deletedAdmin) {
            return res.status(404).json({ 
                success: false, 
                error: "Admin user not found" 
            });
        }

        res.json({ 
            success: true, 
            message: "Admin user deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Server error while deleting admin user" 
        });
    }
};

// Create blog with image (Cloudinary or uploads folder)
exports.createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, error: "Title and content are required" });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const newBlog = new Blog({
            title,
            content,
            image: imageUrl
        });

        await newBlog.save();

        res.status(201).json({ success: true, data: newBlog });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error while creating blog" });
    }
};
