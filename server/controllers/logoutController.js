// Common logout controller (works for both admin & user)
exports.logout = (req, res) => {
  try {
    // cookie clear with same options
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // dev me false, prod me true
      sameSite: "lax",
      path: "/",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
