import Assignment from "../../models/assignment/assignmentModel.js";
import Challenge from "../../models/challenge/challengeModel.js";
import Submission from "../../models/submission/submissionModel.js";
import User from "../../models/user/userModel.js";
import Team from '../../models/team/teamModel.js'
import Course from '../../models/course/courseModel.js'


// 🔹 Function to calculate badge eligibility
const badgeCriteria = [
    {
        title: "Consistent_Solver_30",
        condition: (user, courseId) => {
            const challengesSolved = user.challengessolved
                .filter((challenge) => challenge.courseId.toString() === courseId)
                .sort((a, b) => new Date(a.solvedAt).getTime() - new Date(b.solvedAt).getTime());

            let maxStreak = 0;
            let currentStreak = 1;

            for (let i = 1; i < challengesSolved.length; i++) {
                const diffInDays = (new Date(challengesSolved[i].solvedAt).getTime() -
                    new Date(challengesSolved[i - 1].solvedAt).getTime()) / (1000 * 3600 * 24);

                if (diffInDays === 1) {
                    currentStreak += 1;
                } else {
                    currentStreak = 1;
                }
                maxStreak = Math.max(maxStreak, currentStreak);
            }

            return maxStreak >= 30;
        },
        courseSpecific: true,
    },
    {
        title: "Consistent_Solver_90",
        condition: (user, courseId) => {
            const challengesSolved = user.challengessolved
                .filter((challenge) => challenge.courseId.toString() === courseId)
                .sort((a, b) => new Date(a.solvedAt).getTime() - new Date(b.solvedAt).getTime());

            let maxStreak = 0;
            let currentStreak = 1;

            for (let i = 1; i < challengesSolved.length; i++) {
                const diffInDays = (new Date(challengesSolved[i].solvedAt).getTime() -
                    new Date(challengesSolved[i - 1].solvedAt).getTime()) / (1000 * 3600 * 24);

                if (diffInDays === 1) {
                    currentStreak += 1;
                } else {
                    currentStreak = 1;
                }
                maxStreak = Math.max(maxStreak, currentStreak);
            }

            return maxStreak >= 90;
        },
        courseSpecific: true,
    }
];

// 🔹 Function to check and award badges
async function checkAndAwardBadges(userId, courseId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    for (const badge of badgeCriteria) {
        if (badge.courseSpecific && badge.condition(user, courseId)) {
            const hasBadge = user.badges.some(
                (userBadge) =>
                    userBadge.title === badge.title && userBadge.course.toString() === courseId
            );

            if (!hasBadge) {
                const badgeToAdd = {
                    title: badge.title,
                    course: new Types.ObjectId(courseId),
                    image: `${badge.title}.png`
                };

                await User.findByIdAndUpdate(userId, {
                    $push: {
                        badges: badgeToAdd,
                        inbox: {
                            type: "badge",
                            message: `Congratulations! You've earned the ${badge.title} badge!`,
                            date: new Date()
                        }
                    }
                });
            }
        }
    }
}

export const createSubmission=async (req, res) => {
    try {
        const { user, assignment, challenge, documentLink, courseId, type, groupId } = req.body;
        if (!user || !documentLink) {
            return res.status(400).json({ success: false, message: "User and documentLink are required." });
        }


        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found." });

        if (course.Admins.includes(user)) {
            return res.status(403).json({ success: false, message: "Admin can't make submissions." });
        }

        const newSubmission = new Submission({
            User: user,
            Assignment: assignment,
            Challenge: challenge||null,
            documentLink,
            submittedAt: new Date(),
            Course:courseId,
            type,
            groupId: groupId || null
        });

        await newSubmission.save();

        // ✅ Update user submissions and award badges
        if (groupId) {
            const team = await Team.findById(groupId);
            if (team) {
                for (const member of team.Members.map((m) => m.memberId)) {
                    await User.findByIdAndUpdate(member, { $push: { submissions: newSubmission._id } });
                    await checkAndAwardBadges(member, Course);
                }
            }
        } else {
            await User.findByIdAndUpdate(user, { $push: { submissions: newSubmission._id } });
            await checkAndAwardBadges(user, Course);
        }

        // ✅ Update Assignment and Challenge
        if (assignment) {
            await Assignment.findByIdAndUpdate(assignment, { $push: { submissions: newSubmission._id } });
        }
        if (challenge) {
            await Challenge.findByIdAndUpdate(challenge, { $push: { submissions: newSubmission._id } });
        }

        return res.status(201).json({ success: true, data: newSubmission, message: "Submission added successfully." });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to add submission.", error: error.message });
    }
}

export const getSubmissionById=async (req, res) => {
    try {
        const { Id } = req.query;
        if (!Id) return res.status(400).json({ success: false, message: "Invalid Id" });

        const submission = await Submission.findById(Id);
        if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });

        return res.status(200).json({ success: true, data: submission });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch submission.", error: error.message });
    }
}


export const approveASubmission=async (req, res) => {
    try {
        const { Id } = req.query;
        const submissionId=Id;

        if (!submissionId) {
            return res.status(400).json({ message: "Submission ID is required" });
        }

        const findSubmission = await Submission.findById(submissionId);

        if (!findSubmission) {
            return res.status(404).json({ message: "Submission doesn't exist" });
        }

        if (findSubmission.isVerified === true) {
            return res.status(400).json({ message: "Submission already approved" });
        }

        findSubmission.isVerified = true;
        let points = 0;
        let courseId = null;

        if (findSubmission.Challenge) {
            const challenge = await Challenge.findById(findSubmission.Challenge);
            points = challenge?.points || 0;
            courseId = challenge?.courseId;
            findSubmission.marksObtained = points;
        } else if (findSubmission.Assignment) {
            const assignment = await Assignment.findById(findSubmission.Assignment);
            points = assignment?.totalPoints || 0;
            courseId = assignment?.Course;
            findSubmission.marksObtained = points;
        }

        // ✅ Handling team submissions
        if (findSubmission.type === "team") {
            const team = await Team.findById(findSubmission.groupId);
            if (team) {
                const members = team.Members.map((member) => member.memberId);
                const pointsPerMember = points / members.length;

                for (const memberId of members) {
                    const user = await User.findById(memberId);
                    if (user) {
                        const courseIndex = user.Totalpoints.findIndex(
                            (entry) => String(entry.courseId) === String(courseId)
                        );

                        if (courseIndex >= 0) {
                            user.Totalpoints[courseIndex].points += pointsPerMember;
                        } else {
                            user.Totalpoints.push({ courseId, points: pointsPerMember });
                        }
                        await user.save();
                    }
                }
            }
        } else {
            // ✅ Handling individual submissions
            const user = await User.findById(findSubmission.User);
            if (user) {
                const courseIndex = user.Totalpoints.findIndex(
                    (entry) => String(entry.courseId) === String(courseId)
                );

                if (courseIndex >= 0) {
                    user.Totalpoints[courseIndex].points += points;
                } else {
                    user.Totalpoints.push({ courseId, points });
                }
                await user.save();
            }
        }

        await findSubmission.save();

        return res.status(200).json({
            message: "Submission approved successfully",
            submission: findSubmission,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error while approving the submission",
            error: error.message,
        });
    }
}

export const approveAllSubmissionAssignment=async (req, res) => {
    try {
        const { Id } = req.query;
        const assignmentId=Id;
        if (!assignmentId) {
            return res.status(400).json({ message: "Assignment ID is required" });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const points = assignment.TotalPoints;
        const courseId = assignment.Course;
        const submissions = await Submission.find({ Assignment: assignmentId });

        for (const submission of submissions) {
            if (submission.isVerified) continue;

            submission.isVerified = true;
            submission.marksObtained = points;

            // ✅ Handling team submissions
            if (submission.type === "team") {
                const team = await Team.findById(submission.groupId);
                if (team) {
                    const members = team.Members.map((member) => member.memberId);
                    const pointsPerMember = points / members.length;

                    for (const memberId of members) {
                        const user = await User.findById(memberId);
                        if (user) {
                            const courseIndex = user.Totalpoints.findIndex(
                                (entry) => String(entry.courseId) === String(courseId)
                            );

                            if (courseIndex >= 0) {
                                user.Totalpoints[courseIndex].points += pointsPerMember;
                            } else {
                                user.Totalpoints.push({ courseId, points: pointsPerMember });
                            }
                            await user.save();
                        }
                    }
                }
            } else {
                // ✅ Handling individual submissions
                const user = await User.findById(submission.User);
                if (user) {
                    const courseIndex = user.Totalpoints.findIndex(
                        (entry) => String(entry.courseId) === String(courseId)
                    );

                    if (courseIndex >= 0) {
                        user.Totalpoints[courseIndex].points += points;
                    } else {
                        user.Totalpoints.push({ courseId, points });
                    }
                    await user.save();
                }
            }

            await submission.save();
        }

        return res.status(200).json({
            message: "All submissions approved successfully",
            assignment,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error while approving submissions",
            error: error.message,
        });
    }
}

export const approveAllSubmissionChallenge=async (req, res) => {
    try {
        const { challengeId } = req.query;

        if (!challengeId) {
            return res.status(400).json({ message: "Challenge ID is required" });
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        const points = challenge.points;
        const courseId = challenge.courseId;
        const submissions = await Submission.find({ Challenge: challengeId });

        for (const submission of submissions) {
            if (submission.isVerified) continue;

            submission.isVerified = true;
            submission.marksObtained = points;

            // ✅ Handling team submissions
            if (submission.type === "team") {
                const team = await Team.findById(submission.groupId);
                if (team) {
                    const members = team.Members.map((member) => member.memberId);
                    const pointsPerMember = points / members.length;

                    for (const memberId of members) {
                        const user = await User.findById(memberId);
                        if (user) {
                            const courseIndex = user.Totalpoints.findIndex(
                                (entry) => String(entry.courseId) === String(courseId)
                            );

                            if (courseIndex >= 0) {
                                user.Totalpoints[courseIndex].points += pointsPerMember;
                            } else {
                                user.Totalpoints.push({ courseId, points: pointsPerMember });
                            }
                            await user.save();
                        }
                    }
                }
            } else {
                // ✅ Handling individual submissions
                const user = await User.findById(submission.User);
                if (user) {
                    const courseIndex = user.Totalpoints.findIndex(
                        (entry) => String(entry.courseId) === String(courseId)
                    );

                    if (courseIndex >= 0) {
                        user.Totalpoints[courseIndex].points += points;
                    } else {
                        user.Totalpoints.push({ courseId, points });
                    }
                    await user.save();
                }
            }

            await submission.save();
        }

        return res.status(200).json({ message: "All challenge submissions approved successfully" });

    } catch (error) {
        return res.status(500).json({
            message: "Error while approving all challenge submissions",
            error: error.message,
        });
    }
}


export const bonusPoints=async (req, res) => {
    try {
        const { Id:submissionId } = req.query;
        const { bonus } = req.body;

        if (!submissionId || bonus === undefined) {
            return res.status(400).json({ message: "Submission ID and bonus points are required" });
        }

        const findSubmission = await Submission.findById(submissionId);
        if (!findSubmission) {
            return res.status(404).json({ message: "Submission doesn't exist" });
        }
        if (!findSubmission.isVerified) {
            return res.status(400).json({ message: "Submission is not verified yet" });
        }

        let courseId;
        if (findSubmission.Challenge) {
            const challenge = await Challenge.findById(findSubmission.Challenge);
            courseId = challenge?.courseId;
        } else if (findSubmission.Assignment) {
            const assignment = await Assignment.findById(findSubmission.Assignment);
            courseId = assignment?.Course;
        }

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required but was not found" });
        }

        findSubmission.marksObtained += bonus;

        // ✅ Handling team submissions
        if (findSubmission.type === "team") {
            const team = await Team.findById(findSubmission.groupId);
            if (team) {
                const members = team.Members.map((member) => member.memberId);
                const pointsPerMember = bonus / members.length;

                for (const memberId of members) {
                    const user = await User.findById(memberId);
                    if (user) {
                        const courseIndex = user.Totalpoints.findIndex(
                            (entry) => String(entry.courseId) === String(courseId)
                        );

                        if (courseIndex >= 0) {
                            user.Totalpoints[courseIndex].points += pointsPerMember;
                        } else {
                            user.Totalpoints.push({ courseId, points: pointsPerMember });
                        }
                        await user.save();
                    }
                }
            }
        } else {
            // ✅ Handling individual submissions
            const user = await User.findById(findSubmission.User);
            if (user) {
                const courseIndex = user.Totalpoints.findIndex(
                    (entry) => String(entry.courseId) === String(courseId)
                );

                if (courseIndex >= 0) {
                    user.Totalpoints[courseIndex].points += bonus;
                } else {
                    user.Totalpoints.push({ courseId, points: bonus });
                }
                await user.save();
            }
        }

        await findSubmission.save();

        return res.status(200).json({ message: "Bonus points given successfully", submission: findSubmission });

    } catch (error) {
        return res.status(500).json({
            message: "Error while giving bonus points",
            error: error.message,
        });
    }
}

export const deductPoints=async (req, res) => {
    try {
        const { Id:submissionId } = req.query;
        const { deduct } = req.body;

        if (!submissionId || deduct === undefined) {
            return res.status(400).json({ message: "Submission ID and deduction points are required" });
        }

        const findSubmission = await Submission.findById(submissionId);
        if (!findSubmission) {
            return res.status(404).json({ message: "Submission doesn't exist" });
        }
        if (!findSubmission.isVerified) {
            return res.status(400).json({ message: "Submission is not verified yet" });
        }

        let courseId;
        if (findSubmission.Challenge) {
            const challenge = await Challenge.findById(findSubmission.Challenge);
            courseId = challenge?.courseId;
        } else if (findSubmission.Assignment) {
            const assignment = await Assignment.findById(findSubmission.Assignment);
            courseId = assignment?.Course;
        }

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required but was not found" });
        }

        findSubmission.marksObtained -= deduct;

        // ✅ Handling team submissions
        if (findSubmission.type === "team") {
            const team = await Team.findById(findSubmission.groupId);
            if (team) {
                const members = team.Members.map((member) => member.memberId);
                const pointsPerMember = deduct / members.length;

                for (const memberId of members) {
                    const user = await User.findById(memberId);
                    if (user) {
                        const courseIndex = user.Totalpoints.findIndex(
                            (entry) => String(entry.courseId) === String(courseId)
                        );

                        if (courseIndex >= 0 && user.Totalpoints[courseIndex].points >= pointsPerMember) {
                            user.Totalpoints[courseIndex].points -= pointsPerMember;
                        } else {
                            user.Totalpoints.push({ courseId, points: 0 });
                        }
                        await user.save();
                    }
                }
            }
        } else {
            // ✅ Handling individual submissions
            const user = await User.findById(findSubmission.User);
            if (user) {
                const courseIndex = user.Totalpoints.findIndex(
                    (entry) => String(entry.courseId) === String(courseId)
                );

                if (courseIndex >= 0 && user.Totalpoints[courseIndex].points >= deduct) {
                    user.Totalpoints[courseIndex].points -= deduct;
                }
                await user.save();
            }
        }

        await findSubmission.save();

        return res.status(200).json({ message: "Points deducted successfully", submission: findSubmission });

    } catch (error) {
        return res.status(500).json({
            message: "Error while deducting points",
            error: error.message,
        });
    }
}

export const disapproveSubmission=async (req, res) => {
    try {
        const { Id:submissionId } = req.query;

        if (!submissionId) {
            return res.status(400).json({ message: "Submission ID is required" });
        }

        const findSubmission = await Submission.findById(submissionId);
        if (!findSubmission) {
            return res.status(404).json({ message: "Submission doesn't exist" });
        }
        if (!findSubmission.isVerified) {
            return res.status(400).json({ message: "Submission is already disapproved" });
        }

        findSubmission.isVerified = false;
        let points = 0;
        let courseId;

        if (findSubmission.Challenge) {
            const challenge = await Challenge.findById(findSubmission.Challenge);
            points = challenge?.points || 0;
            courseId = challenge?.courseId;
            findSubmission.marksObtained = 0;
        } else if (findSubmission.Assignment) {
            const assignment = await Assignment.findById(findSubmission.Assignment);
            points = assignment?.totalPoints || 0;
            courseId = assignment?.Course;
            findSubmission.marksObtained = 0;
        }

        // ✅ Handling team submissions
        if (findSubmission.type === "team") {
            const team = await Team.findById(findSubmission.groupId);
            if (team) {
                const members = team.Members.map((member) => member.memberId);
                const pointsPerMember = points / members.length;

                for (const memberId of members) {
                    const user = await User.findById(memberId);
                    if (user) {
                        const courseIndex = user.Totalpoints.findIndex(
                            (entry) => String(entry.courseId) === String(courseId)
                        );

                        if (courseIndex >= 0 && user.Totalpoints[courseIndex].points >= pointsPerMember) {
                            user.Totalpoints[courseIndex].points -= pointsPerMember;
                        } else {
                            user.Totalpoints.push({ courseId, points: 0 });
                        }
                        await user.save();
                    }
                }
            }
        } else {
            // ✅ Handling individual submissions
            const user = await User.findById(findSubmission.User);
            if (user) {
                const courseIndex = user.Totalpoints.findIndex(
                    (entry) => String(entry.courseId) === String(courseId)
                );

                if (courseIndex >= 0 && user.Totalpoints[courseIndex].points >= points) {
                    user.Totalpoints[courseIndex].points -= points;
                }
                await user.save();
            }
        }

        await findSubmission.save();

        return res.status(200).json({ message: "Submission disapproved successfully", submission: findSubmission });

    } catch (error) {
        return res.status(500).json({
            message: "Error while disapproving the submission",
            error: error.message,
        });
    }
}

export const editSubmission=async (req, res) => {
    try {
        const { id } = req.query;
        const { documentLink } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Submission ID is required",
            });
        }

        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }

        submission.documentLink = documentLink;
        await submission.save();

        return res.status(200).json({
            success: true,
            message: "Submission edited successfully",
            data: submission,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to edit submission",
            error: error.message,
        });
    }
}

export const getAllSubmissions=async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.submissions || !Array.isArray(user.submissions)) {
            return res.status(400).json({
                success: false,
                message: "No submissions found for the user",
            });
        }

        // Fetch all submissions and populate related fields
        const submissions = await Submission.find({ _id: { $in: user.submissions } })
            .populate("User")
            .populate("Course")
            .populate("Assignment")
            .populate("Challenge");

        return res.status(200).json({
            success: true,
            message: "Successfully fetched submissions",
            submissions,
        });
    } catch (error) {
        console.error("Error fetching user submissions:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching user submissions",
            error: error.message || error,
        });
    }
}

export const getSubmissionByAssignment=async (req, res) => {
    try {
        const { assignmentId } = req.query;

        if (!assignmentId) {
            return res.status(400).json({
                success: false,
                message: "Assignment ID is required",
            });
        }

        const submissions = await Submission.find({ Assignment: assignmentId });

        return res.status(200).json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch submissions",
            error: error.message || error,
        });
    }
}

export const getSubmissionByAssignmentAndUser=async (req, res) => {
    try {
        const { assignmentId, userId } = req.query;

        if (!assignmentId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Assignment ID and User ID are required",
            });
        }

        const submissions = await Submission.find({ Assignment: assignmentId, User: userId });

        return res.status(200).json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch submissions",
            error: error.message || error,
        });
    }
}

export const getSubmissionByChallenge=async (req, res) => {
    try {
        const { challengeId, userId } = req.query;

        if (!challengeId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Challenge ID and User ID are required",
            });
        }

        const submissions = await Submission.find({ Challenge: challengeId, User: userId });

        return res.status(200).json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch submissions",
            error: error.message || error,
        });
    }
}

export const getSubmissionByCourseAndUser=async (req, res) => {
    try {
        const { CourseId, userId } = req.query;

        if (!CourseId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Course ID and User ID are required",
            });
        }

        const submissions = await Submission.find({ Course: CourseId, User: userId });

        return res.status(200).json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        console.error("Error fetching course submissions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course submissions",
            error: error.message || error,
        });
    }
};

export const getSubmissionByChallengeAndUser = async (req, res) => {
    try {
        const { challengeId, userId } = req.query;

        // Ensure both query parameters are provided
        if (!challengeId || !userId) {
            return res.status(400).json({ message: "Missing challengeId or userId" });
        }

        // Fetch all submissions matching the challengeId and userId
        const submissions = await Submission.find({ challengeId, userId });

        if (submissions.length === 0) {
            return res.status(404).json({ message: "No submissions found" });
        }

        return res.status(200).json({ message: "Successfully found submissions", submissions });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const removeSubmission=async (req, res) => {
    try {
        const { Id } = req.query;
        const submissionId=Id;
        if (!submissionId) {
            return res.status(400).json({ message: "Submission ID is required." });
        }

        const findSubmission = await Submission.findById(submissionId);
        if (!findSubmission) {
            return res.status(404).json({ message: "Submission doesn't exist." });
        }

        const { User: userId, Assignment: assignmentId, Challenge: challengeId } = findSubmission;

        // ✅ Remove submission from Challenge if exists
        if (challengeId) {
            await Challenge.findByIdAndUpdate(challengeId, {
                $pull: { submissions: submissionId }
            }, { new: true });
        }

        // ✅ Remove submission from Assignment if exists
        if (assignmentId) {
            await Assignment.findByIdAndUpdate(assignmentId, {
                $pull: { submissions: submissionId }
            }, { new: true });
        }

        // ✅ Remove submission from User
        await User.findByIdAndUpdate(userId, {
            $pull: { submissions: submissionId }
        }, { new: true });

        // ✅ Delete the submission
        await Submission.findByIdAndDelete(submissionId);

        return res.status(200).json({ message: "Submission successfully removed", submission: findSubmission });

    } catch (error) {
        return res.status(500).json({ message: "Error while removing submission", error: error.message });
    }
}

