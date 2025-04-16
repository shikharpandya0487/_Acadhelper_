import Challenge from '../../models/challenge/challengeModel.js';
import Course from '../../models/course/courseModel.js'
import User from '../../models/user/userModel.js'
import Event from '../../models/event/eventModal.js'

export const addChallenge=async (req, res) => {
    try {
        
        const { title, description, type, frequency, challengeDoc, endDate, startDate, points, createdBy, courseId } = req.body;
        console.log(courseId);
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Invalid Course Id" });
        } 

        const course = await Course.findById(courseId);
        console.log(course);
        if (!course) {
             return res.status(404).json({ success: false, message: "Invalid Course" });
        }

        if (!title || !description || !type || !startDate || !endDate || !points || !createdBy || !courseId || !frequency || !challengeDoc) {
             return res.status(400).json({ success: false, message: "All fields are required." });
        }
        const newChallengeData=req.body;

        const newChallenge = new Challenge(newChallengeData);
        const savedChallenge = await newChallenge.save();

        await Course.findByIdAndUpdate(courseId, { $push: { challenges: savedChallenge._id } }, { new: true });

       res.status(201).json({
            success: true,
            message: "Challenge created successfully",
            data: savedChallenge,
        });
    } catch (error) {
        console.log(error); 
         return res.status(500).json({
            success: false,
            message: "Failed to create challenge",
            error: error.message,
        });
    }
}

export const deleteChallenge=async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: "Id not found" });
        }

        const deletedChallenge = await Challenge.findByIdAndDelete(id);
        if (!deletedChallenge) {
            return res.status(404).json({ success: false, message: "Challenge not found" });
        }

        // Remove the challenge from the course's challenges array
        await Course.findByIdAndUpdate(
            deletedChallenge.courseId,
            { $pull: { challenges: deletedChallenge._id } },
            { new: true }
        );

        const course = await Course.findById(deletedChallenge.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Find and delete all events related to the deleted challenge
        const deletedEvents = await Event.find({ challengeId: deletedChallenge._id });
        await Event.deleteMany({ challengeId: deletedChallenge._id });

        // Extract the IDs of the deleted events
        const eventIds = deletedEvents.map(event => event._id);

        // Remove the deleted event IDs from the `events` array in user documents
        await User.updateMany(
            { events: { $in: eventIds } },
            { $pull: { events: { $in: eventIds } } }
        );

        return res.status(200).json({
            success: true,
            message: "Challenge and related events deleted successfully",
            data: deletedChallenge,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete challenge",
            error: error.message,
        });
    }
}

export const editChallenge=async (req, res) => {
    try {
        const { Id } = req.query;
        const id=Id;
        if (!id) {
            return res.status(400).json({ success: false, message: "Id not found" });
        }

        const challenge = await Challenge.findById(id);
        if (!challenge) {
            return res.status(404).json({ success: false, message: "Challenge not found" });
        }

        const { title, description, type, frequency, challengeDoc, startDate, points } = req.body;
        if (!title || !description || !type || !startDate || !points || !frequency || !challengeDoc) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Calculate 'endDate' based on the frequency
        let End = new Date(startDate);
        console.log(End);
        if (frequency === "daily") {
            // End.setDate(End.getDate() + 1);
        }
        if (frequency === "weekly") {
            // End.setDate(End.getDate() + 7);
        }

        const updatedChallenge = await Challenge.findByIdAndUpdate(
            id,
            {
                title,
                description,
                endDate: End.toISOString().split('T')[0],
                type,
                frequency,
                challengeDoc,
                startDate,
                points,
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Challenge edited successfully",
            data: updatedChallenge,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to edit challenge",
            error: error.message,
        });
    }
}

export const getAllChallengeOfCourse=async (req, res) => {
    try {
        const { courseId } = req.query;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const challenges = course.challenges; // Extracting challenges from course

        return res.status(200).json({
            message: "Successfully fetched all challenges",
            length: challenges.length,
            challenges,
        });

    } catch (error) {
        console.error("Error while fetching all challenges:", error);
        return res.status(500).json({
            message: "Error while fetching all challenges",
            error: error.message,
        });
    }
}

export const challengeByFreq=async (req, res) => {
    try {
        const { frequency, userId } = req.body;

        if (frequency !== "daily" && frequency !== "weekly") {
            return res.status(400).json({
                success: false,
                message: "Invalid frequency provided.",
            });
        }

        // Find the user by 'userId' and populate their 'Courses' field with course details
        const user = await User.findById(userId).populate("Courses");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Extract the 'courseId' from each course in the user's 'Courses' field
        const courseIds = user.Courses.map((course) => course.courseId);

        // Fetch challenges based on the extracted courseIds and given frequency
        const challenges = await Challenge.find({
            courseId: { $in: courseIds },
            frequency: frequency,
        });

        return res.status(200).json({
            success: true,
            data: challenges,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch challenges.",
            error: error.message,
        });
    }
}

export const challengeByCourse=async (req, res) => {
    try {
        const { CourseId } = req.query;

        if (!CourseId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID",
            });
        }

        const course = await Course.findById(CourseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (course.challenges.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: "No challenges found.",
            });
        }

        const challenges = await Challenge.find({ _id: { $in: course.challenges } });

        return res.status(200).json({
            success: true,
            data: challenges,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch challenges.",
            error: error.message,
        });
    }
}

export const getChallengeById=async (req, res) => {
    try {
        const { Id } = req.query;

        if (!Id) {
            return res.status(400).json({
                success: false,
                message: "Invalid Challenge ID",
            });
        }

        const challenge = await Challenge.findById(Id);

        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: challenge,
        });

    } catch (error) {
        console.error("Error fetching challenge:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch challenge.",
            error: error.message,
        });
    }
}
export const updateChallenge = async (req, res) => {
    try {
        const { createdBy, challengeId, title, description, startDate, endDate, challengeDoc, type, frequency, points } = req.body;

        // Check if challengeId and createdBy are provided
        if (!challengeId) {
            return res.status(400).json({ message: "Challenge ID is required" });
        }
        if (!createdBy) {
            return res.status(400).json({ message: "Admin ID is required to update the challenge" });
        }

        // Validate user existence
        const user = await User.findById(createdBy);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate challenge existence
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        // Ensure the user is an admin for the course associated with the challenge
        if (!user.CoursesAsAdmin.includes(challenge.courseId)) {
            return res.status(403).json({ message: "User is not authorized to update this challenge" });
        }

        // Validate required fields
        if (!title || !description || !startDate || !endDate || !type || !frequency || points === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Ensure valid type and frequency values
        const validTypes = ['individual', 'team'];
        const validFrequencies = ['daily', 'weekly'];

        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid challenge type" });
        }
        if (!validFrequencies.includes(frequency)) {
            return res.status(400).json({ message: "Invalid challenge frequency" });
        }

        // Ensure valid dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ message: "Start date must be before end date" });
        }

        // Update challenge
        const updatedChallenge = await Challenge.findByIdAndUpdate(
            challengeId,
            { title, description, startDate, endDate, challengeDoc, type, frequency, points },
            { new: true }
        );

        return res.status(200).json({ 
            message: "Challenge updated successfully", 
            challenge: updatedChallenge 
        });

    } catch (error) {
        console.error("Error updating challenge:", error);
        return res.status(500).json({ message: "An error occurred while updating the challenge" });
    }
};

export const uploadChallenge=async (req, res) => {
    try {
        const { title, description, startDate, endDate, challengeDoc, type, frequency, points, createdBy, courseId } = req.body;

        // Validate if the creator exists
        const user = await User.findById(createdBy);
        if (!user) {
            return res.status(403).json({ message: "User doesn't exist" });
        }

        // Validate required fields
        if (!title || !challengeDoc || !description || !type || !frequency || !startDate || !courseId || !createdBy) {
            return res.status(400).json({ message: "Required fields are empty" });
        }

        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Course needs to be created first" });
        }

        // Create the new challenge
        const newChallenge = new Challenge({
            title,
            description,
            startDate,
            endDate,
            challengeDoc,
            type,
            frequency,
            points,
            createdBy,
            courseId,
        });
        await newChallenge.save();

        // Create an event for each enrolled student in the course
        const eventPromises = course.StudentsEnrolled.map(async (studentId) => {
            const newEvent = new Event({
                title,
                User: studentId,
                challengeId: newChallenge._id,
                endDate
            });
            await newEvent.save();
            await User.findByIdAndUpdate(studentId, { $push: { events: newEvent._id } });
        });

        await Promise.all(eventPromises);

        // Add the challenge to the course
        course.challenges.push(newChallenge._id);
        await course.save();

        return res.status(201).json({ message: "Challenge uploaded successfully.", Challenge: newChallenge });

    } catch (error) {
        console.error("Error uploading challenge:", error);
        return res.status(500).json({ message: "An error occurred while uploading the challenge.", error: error.message });
    }
}

