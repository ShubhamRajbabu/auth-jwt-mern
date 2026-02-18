import User from "../models/user.model.js";

const userController = async (req, res) => {
    const user = req.user; //from authMiddleware, we are getting the user details by verifying jwt token and attaching the user details to req object, so we can access it here in userController
    const userInDb = await User.findById(user.id).select("-password"); //we are selecting all the fields except password, because we don't want to send the password to the client
    if (!userInDb) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: userInDb });
}

export default userController;