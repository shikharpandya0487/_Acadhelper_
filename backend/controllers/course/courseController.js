import Assignment from "../../models/assignment/assignmentModel.js";
import Course from "../../models/course/courseModel.js";
import User from "../../models/user/userModel.js";
import mongoose from 'mongoose'
// ✅ Random code generation function
function generateRandomCode(length = 6) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const createCourse = async (req, res) => {
  try {
    const { name, description, userId } = req.body;

    if (!name || !description || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let courseCode = generateRandomCode();

    // Ensure unique CourseCode
    let existingCourse = await Course.findOne({ CourseCode: courseCode });
    while (existingCourse) {
      courseCode = generateRandomCode();
      existingCourse = await Course.findOne({ CourseCode: courseCode });
    }

    const newCourse = new Course({
      name,
      description,
      CourseCode: courseCode,
      Admins: [userId],
    });

    await newCourse.save();

    // Update user to include the new course as admin
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { CoursesAsAdmin: newCourse._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEnrolledUsersCourse = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "The course doesn't exist" });
    }

    const userIds = course.StudentsEnrolled;

    // Fetch all users in parallel
    const users = await User.find({ _id: { $in: userIds } });

    return res.status(200).json({
      message: "Users enrolled in the course fetched successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching the users enrolled in the course",
      error: error.message,
    });
  }
};

export const joinCourse = async (req, res) => {
  try {
    const { code, userId } = req.body;

    // Check if course exists
    const courseExist = await Course.findOne({ CourseCode: code });
    if (!courseExist) {
      return res.status(400).json({ error: "Course code is invalid" });
    }

    // Check if user exists
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if user has already joined the course
    if (userExist.Courses.includes(courseExist._id)) {
      return res
        .status(400)
        .json({ error: "You have already joined this course" });
    }

    // Check if user is an admin of the course
    if (userExist.CoursesAsAdmin.includes(courseExist._id)) {
      return res
        .status(400)
        .json({
          error:
            "You are an admin of this course and cannot join as a student.",
        });
    }

    // Update the course by adding the user
    await Course.findOneAndUpdate(
      { CourseCode: code },
      { $push: { StudentsEnrolled: userId } },
      { new: true }
    );

    // Update the user by adding the course
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          Courses: { courseId: courseExist._id, enrolledAt: new Date() },
        },
      },
      { new: true }
    );

    return res.json({ message: "Course joined successfully", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { type, userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    let coursesEnrolled = [];
    let coursesAdmin = [];

    if (type === "enrolled" || type === "both") {
      const courseList = user.Courses.map((course) => course.courseId);
      coursesEnrolled = await Course.find({ _id: { $in: courseList } }).select(
        "_id name CourseCode"
      );
    }

    if (type === "admin" || type === "both") {
      coursesAdmin = await Course.find({
        _id: { $in: user.CoursesAsAdmin },
      }).select("_id name CourseCode");
    }

    const courses = [...coursesEnrolled, ...coursesAdmin];

    return res.status(200).json({ courses, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Please Login first" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const courseList = user.Courses.map((course) => course.courseId);
    const courses = await Course.find({ _id: { $in: courseList } }).select(
      "_id name"
    );

    res.status(200).json({ courses, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getOneCourse = async (req, res) => {
  try {
    const { courseId } = req.query;
    const course = await Course.findOne({ _id: courseId });

    if (!course)
      res.status(400).json({ error: "Course not found" }, { status: 400 });

    res.status(200).json({message:"Successfully fetched one course",course});
    
  } catch (error) {
    res.status(500).json({error,message:"Internal Server Error"})
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { userId,courseId } = req.query;

    // Validate inputs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({ error: "Invalid user or course ID" });
    }

    // Remove course from user's courses list
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { Courses: { courseId: courseId },CoursesAsAdmin:courseId }, },
      { new: true }
    );
 
    if (!updatedUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Remove user from course's enrolled students list
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { StudentsEnrolled: userId } },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(400).json({ error: "Course not found" });
    }

    // Remove assignments related to this course from user's pending assignments
    const assignments = await Assignment.find({ Course: courseId });
    const assignmentIds = assignments.map((assignment) => assignment._id);

    const updatedUserWithAssignments = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { pendingAssignments: { assignmentId: { $in: assignmentIds } } },
      },
      { new: true }
    );

    if (!updatedUserWithAssignments) {
      return res.status(400).json({ error: "User not found" });
    }

    return res.status(200).json({ updatedUserWithAssignments, success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const kickUser = async (req, res) => {
  try {
    const { userId, courseId } = req.query;

    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ message: "Enter all necessary credentials" });
    }

    // Find course
    const requiredCourse = await Course.findById(courseId);
    if (!requiredCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Check if user is enrolled in the course
    if (!requiredCourse.StudentsEnrolled.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is not enrolled in this course." });
    }

    // Remove course from user's enrolled courses
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { Courses: { courseId: courseId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Remove user from course's enrolled students list
    requiredCourse.StudentsEnrolled = requiredCourse.StudentsEnrolled.filter(
      (student) => !student.equals(userId)
    );

    // Remove assignments related to this course from user's pending assignments
    const assignments = await Assignment.find({ Course: courseId });
    const assignmentIds = assignments.map((assignment) => assignment._id);

    const updatedUserWithAssignments = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { pendingAssignments: { assignmentId: { $in: assignmentIds } } },
      },
      { new: true }
    );

    if (!updatedUserWithAssignments) {
      return res.status(400).json({ error: "User not found" });
    }

    // Save the updated course
    const updatedCourse = await requiredCourse.save();

    return res
      .status(200)
      .json({
        message: "User removed from course successfully.",
        updatedCourse,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error while removing user from the course",
        error: error.message,
      });
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const { userId, adminId, courseId } = req.body;

    if (!userId || !adminId || !courseId) {
      return res.status(400).json({ error: "ID is required" });
    }

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course) {
      return res.status(400).json({ error: "Invalid course" });
    }
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }

    // Check if user is enrolled
    const isEnrolled = course.StudentsEnrolled.includes(userId);
    if (isEnrolled) {
      await Course.findByIdAndUpdate(courseId, {
        $pull: { StudentsEnrolled: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { Courses: { courseId: courseId } },
      });
    }

    // Make the user an admin
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { Admins: userId } },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(400).json({ error: "Failed to update course" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { CoursesAsAdmin: courseId } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(400).json({ error: "Failed to update user" });
    }

    return res.status(200).json({ message: "User successfully made an admin" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const removeAdmin = async (req, res) => {
  try {
    const { userId, adminId, courseId } = req.body;

    if (!userId || !adminId || !courseId) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Remove user from course's admin list and ensure they remain a student
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: { Admins: userId },       // Remove from Admins
        $addToSet: { Students: userId }, // Ensure they are in Students
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(400).json({ error: "Invalid course" });
    }

    // Remove course from user's admin list, but don't remove it from enrolled courses
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { CoursesAsAdmin: courseId }, // Remove from Admin list
        $addToSet: { EnrolledCourses: courseId }, // Ensure they remain enrolled
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ error: "Invalid user" });
    }

    return res.status(200).json({ message: "User is no longer an admin but remains enrolled" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
