import Course from '../../models/course/courseModel.js'
import Assignment from '../../models/assignment/assignmentModel.js'
import User from '../../models/user/userModel.js'
import Event from '../../models/event/eventModal.js'




export const getAssignmentById=async (req, res) => {
    try {
        const { Id } = req.query;

        // Find assignment by ID
        const assignment = await Assignment.findById(Id);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            data: assignment,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch assignment.",
            error: error.message,
        });
    }
}

export const uploadAssignment=async (req, res) => {
    try {
        const { title, description, DueDate, uploadedAt, AssignmentDoc, CourseId, status, totalPoints } = req.body;

        // Validate required fields
        if (!title || !AssignmentDoc || !description || !uploadedAt || !DueDate || !totalPoints || !CourseId) {
            return res.status(400).json({ message: "Required fields are empty" });
        }

        // Check if course exists
        const course = await Course.findById(CourseId);
        if (!course) {
            return res.status(400).json({ message: "Course not found" });
        }

        // Create new assignment
        const newAssignment = new Assignment({
            title,
            description,
            DueDate: new Date(DueDate),
            uploadedAt,
            AssignmentDoc,
            Course: CourseId,
            status,
            totalPoints,
        });

        await newAssignment.save();

        // Add assignment ID to course
        course.assignments.push(newAssignment._id);
        await course.save();

        // Create events for enrolled students
        const eventPromises = course.StudentsEnrolled.map(async (studentId) => {
            const newEvent = new Event({
                title,
                User: studentId,
                assignmentId: newAssignment._id,
                endDate: DueDate,
            });

            await newEvent.save();
            await User.findByIdAndUpdate(studentId, { $push: { events: newEvent._id } });
        });

        await Promise.all(eventPromises);

        return res.status(201).json({
            message: "Assignment uploaded successfully.",
            Assignment: newAssignment,
        });

    } catch (error) {
        console.error("Error uploading assignment:", error);
        return res.status(500).json({
            message: "An error occurred while uploading the assignment.",
            error: error.message,
        });
    }
}

export const getPendingAssignmentOfUser=async (req, res) => {
    try {
        const { userId } = req.query; // Extracting user ID from URL params

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Find assignments that are in the user's pending assignments array
        const assignments = await Assignment.find({ _id: { $in: user.pendingAssignments } });

        return res.status(200).json({
            success: true,
            data: assignments,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch assignments.",
            error: error.message,
        });
    }
}

export const deleteAssignment=async (req, res) => {
    try {
        const { id } = req.query;
        const { userId } = req.query;

        if (!id || !userId) {
            return res.status(400).json({ message: "Assignment ID and User ID are required" });
        }

        // Check if the user is an admin before proceeding
        const checkUser = await User.findById(userId);
        if (!checkUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!checkUser.isAdmin) {
            return res.status(403).json({ message: "No access. User is not authorized" });
        }

        // Find and delete the assignment
        const deletedAssignment = await Assignment.findByIdAndDelete(id);
        if (!deletedAssignment) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }

        // Update the course to remove the assignment
        const course = await Course.findByIdAndUpdate(
            deletedAssignment.Course,
            { $pull: { assignments: deletedAssignment._id } },
            { new: true }
        );

        // Delete events associated with the assignment
        const deletedEvents = await Event.deleteMany({ assignmentId: deletedAssignment._id });

        // Update all users who had events related to this assignment
        const affectedUsers = await User.updateMany(
            { "events.assignmentId": deletedAssignment._id },
            { $pull: { events: { assignmentId: deletedAssignment._id } } }
        );

        return res.status(200).json({
            success: true,
            message: "Assignment deleted successfully",
            data: deletedAssignment,
            course,
            affectedUsers
        });

    } catch (error) {
        console.error("Error deleting assignment:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete Assignment",
            error: error.message,
        });
    }
}

export const getAssignmentByCourse=async (req, res) => {
    try {
        const { CourseId } = req.params;

        if (!CourseId) {
            return res.status(400).json({
                success: false,
                message: "Invalid CourseId",
            });
        }

        const course = await Course.findById(CourseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Fetch assignments linked to the course
        const assignments = await Assignment.find({ _id: { $in: course.assignments } });

        return res.status(200).json({
            success: true,
            data: assignments,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch assignments.",
            error: error.message,
        });
    }
}

export const editAssignment= async (req, res) => {
    try {
        const { Id } = req.query; // Extracting ID from URL params

        // Find assignment by ID
        const assignment = await Assignment.findById(Id);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        // Extracting request body
        const { title, description, AssignmentDoc, DueDate, totalPoints, status } = req.body;

        // Check if all required fields are present
        if (!title || !AssignmentDoc || !description || !status || !DueDate || !totalPoints) {
            return res.status(400).json({
                success: false,
                message: "Required fields are empty",
            });
        }

        // Update Assignment
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            Id,
            { title, description, AssignmentDoc, DueDate, totalPoints, status },
            { new: true }
        );

        if (!updatedAssignment) {
            return res.status(400).json({
                success: false,
                message: "Failed to update assignment",
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Assignment edited successfully",
            data: updatedAssignment,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to edit assignment",
            error: error.message,
        });
    }
}
