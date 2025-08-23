const Blog = require("../models/Blog");
const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";
const SECRET_KEY = "supersecretkey"; // .env me store karna better hoga

// Admin login
exports.loginAdmin = (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ role: "admin", email }, SECRET_KEY, { expiresIn: "1h" });
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
        console.error("❌ Blog creation error:", error);
        res.status(500).json({ success: false, error: "Server error while creating blog" });
    }
};
