const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
        req.user = { id: verified.userId || verified.id }; // Fix: set req.user instead of req.admin
        next();
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        res.status(400).json({ message: "Invalid Token" });
    }
};
