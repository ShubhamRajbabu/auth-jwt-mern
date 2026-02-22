export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        console.log("req user value: ", req.user); // Debugging log
        const userRole = req.user.role;
        console.log("User role from token:", userRole); // Debugging log
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }
        next();
    };
}