import Event from "../../models/event/eventModal.js";
import User from "../../models/user/userModel.js";
 
export const createEvent=async (req, res) => {
    try {
        const { title, userId, DueDate } = req.body;

        if (!title || !userId || !DueDate) {
            return res.status(400).json({ message: "Input all required fields" });
        }

        const event = new Event({
            title,
            User: userId,
            endDate: new Date(DueDate)
        });

        await event.save();

        // Find the user and update their events list
        const user = await User.findByIdAndUpdate(
            userId, 
            { $push: { events: event._id } }, 
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Successfully created event", event, user });

    } catch (error) {
        return res.status(500).json({ message: "Error while creating the event", error: error.message });
    }
}

export const deleteEvent=async (req, res) => {
    try {
        const { eventId, userId } = req.params; // Extract query parameters

        if (!eventId || !userId) {
            return res.status(400).json({ message: "Event ID and User ID are required" });
        }

        // Remove the event reference from the user's events array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { events: eventId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found or unable to update user events" });
        }

        // Delete the event
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(400).json({ message: "Event not found or already deleted" });
        }

        return res.status(200).json({ message: "Event deleted successfully", success: true });

    } catch (error) {
        return res.status(500).json({ message: "Error while deleting the event", error: error.message });
    }
}

export const getAllEvents=async (req, res) => {
    try {
        const { userId } = req.query; // Extract query parameters

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Find events associated with the user
        const events = await Event.find({ _id: { $in: user.events } });

        return res.status(200).json({ message: "Successfully fetched events", events });

    } catch (error) {
        return res.status(500).json({ message: "Error while fetching the events", error: error.message });
    }
}

export const updateEvent=async (req, res) => {
    try {
        const { title, DueDate, userId, eventId } = req.body;

        if (!userId || !eventId) {
            return res.status(400).json({ message: "User ID and Event ID are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(400).json({ message: "Event not found" });
        }

        if (String(event.User) !== String(user._id)) {
            return res.status(403).json({ message: "You are not authorized to update this event" });
        }

        // Update event details
        if (title) event.title = title;
        if (DueDate) event.endDate = DueDate;
        await event.save();

        return res.status(200).json({
            message: "Event updated successfully",
            event,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to update the event",
            error: error.message,
        });
    }
}
