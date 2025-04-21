import User from "../../models/user/userModel.js";

export const deleteNotification=async (req, res) => {
    try {
        const { userId, notificationId } = req.query;

        if (!userId || !notificationId) {
            return res.status(400).json({ error: "User ID and Notification ID are required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { inbox: { _id: notificationId } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "Notification deleted", success: true, updatedUser });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}