import Team from "../../models/team/teamModel.js"
import User from '../../models/user/userModel.js'
import mongoose from 'mongoose'

export const createTeam=async (req, res) => {
    try {
        const { team, userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Set the first member as the user creating the team
        team.Members[0] = { memberId: new mongoose.Types.ObjectId(userId) };

        let newTeam = new Team(team);
        newTeam = await newTeam.save();

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { teams: { teamId: newTeam._id, joinedAt: Date.now() } } },
            { new: true }
        );

        if (!user) return res.status(400).json({ error: "User does not exist" });

        return res.status(200).json({ teams: user.teams, team: newTeam, success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteTeam=async (req, res) => {
    try {
        const { teamId } = req.query;

        if (!teamId || !mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({ error: "Invalid team ID" });
        }

        const deletedTeam = await Team.findByIdAndDelete(teamId);
        if (!deletedTeam) return res.status(400).json({ error: "Team not found" });

        await User.updateMany(
            { "teams.teamId": teamId },
            { $pull: { teams: { teamId: teamId } } }
        );

        return res.status(200).json({ message: "Team deleted successfully", success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllTeamMembers=async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: "User does not exist" });

        const teamIds = user.teams.map((team) => team.teamId);
        const teams = await Team.find({ _id: { $in: teamIds } });

        return res.status(200).json({ teams, success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const editTeam=async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const { team } = req.body;

        const updatedTeam = await Team.findByIdAndUpdate(teamId, team, { new: true });

        if (!updatedTeam) return res.status(400).json({ error: "Group not found" });

        return res.json({ updatedTeam, success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const addMemberToTeam=async (req, res) => {
    try {
        const { email } = req.body;
        const teamId = req.params.teamId;

        const team = await Team.findById(teamId);
        if (!team) return res.status(400).json({ error: "Group not found" });

        const newUser = await User.findOne({ email: email });
        if (!newUser) return res.status(400).json({ error: "User not found" });

        // Check if user is already a member
        if (team.Members.some((member) => member.memberId.equals(newUser._id))) {
            return res.status(400).json({ error: `${newUser.username} is already a member of this group` });
        }

        // Check if max team size is reached
        if (team.Members.length === team.maxteamsize) {
            return res.status(409).json({ error: "Maximum team limit reached" });
        }

        // Check if invite is already sent
        if (team.pendingInvites.includes(email)) {
            return res.status(409).json({ error: "Invitation already sent" });
        }

        await User.findOneAndUpdate(
            { email: email },
            {
                $push: {
                    inbox: {
                        type: "group invite",
                        message: `You have been invited by ${team.teamname}`,
                        teamId: teamId
                    }
                }
            },
            { new: true }
        );

        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $push: { pendingInvites: email } },
            { new: true }
        );

        return res.json({ updatedTeam, success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const leaveTeam=async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const { userId } = req.query;

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: "User not found" });

        const team = await Team.findById(teamId);
        if (!team) return res.status(400).json({ error: "Team not found" });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { teams: { teamId: teamId } } },
            { new: true }
        );

        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $pull: { Members: { memberId: userId } } },
            { new: true }
        );

        return res.json({ updatedUser,updatedTeam, success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getTeamDetails=async (req, res) => {
    const teamId = req.params.teamId;
    const { type } = req.query;

    console.log(teamId,type);

    try {
        if (type === "Team") {
            const team = await Team.findById(teamId);
            if (!team) return res.status(400).json({ error: "Team not found" });

            return res.json({ team, success: true });
        } else if (type === "Members") {
            const team = await Team.findById(teamId);
            if (!team) return res.status(400).json({ error: "Team not found" });

            const memberIds = team.Members.map((member) => member.memberId);
            const team_members = await User.find({ _id: { $in: memberIds } });
            // console.log(team_members);
            return res.json({ members: team_members, success: true });
        } else {
            return res.status(500).json({ error: "GET request ambiguous" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const teamInvitation=async (req, res) => {
    try {
        const { approval, userId, teamId, mail } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: "User not found" });

        const team = await Team.findById(teamId);
        if (!team) return res.status(400).json({ error: "Group does not exist" });

        if (!approval) {
            // Reject Invite
            await User.findByIdAndUpdate(userId, { $pull: { inbox: mail } }, { new: true });
            const leader = await User.findByIdAndUpdate(team.leader, {
                $push: { inbox: { type: "invite rejected", message: `${user.username} rejected the join request`, teamId } }
            }, { new: true });
            
            const updatedTeam = await Team.findByIdAndUpdate(teamId, { $pull: { pendingInvites: user.email } }, { new: true });

            return res.json({ message: "Invite rejected", success: true, updatedTeam, user, leader });
        } else {
            // Accept Invite
            if (team.Members.some(member => member._id.equals(userId))) {
                return res.status(400).json({ error: "You are already a member of this group" });
            }

            const updatedUser = await User.findByIdAndUpdate(userId, {
                $pull: { inbox: mail },
                $push: { teams: { teamId: teamId } }
            }, { new: true });

            const leader = await User.findByIdAndUpdate(team.leader, {
                $push: { inbox: { type: "invite accepted", message: `${updatedUser.username} accepted your invite to join ${team.teamname}` } }
            }, { new: true });

            const updatedTeam = await Team.findByIdAndUpdate(teamId, {
                $pull: { pendingInvites: updatedUser.email },
                $push: { Members: { memberId: updatedUser._id } }
            }, { new: true });

            return res.json({ message: "Invite accepted", success: true, updatedTeam, updatedUser, leader });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const addTeamTask=async (req, res) => {
    try {
        const { task, userId, teamId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "You are not logged in" });
        }
        if (!task.text) {
            return res.status(400).json({ error: "Task cannot be empty" });
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $push: { tasks: task } },
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(400).json({ error: "Team not found" });
        }

        return res.status(201).json({
            message: "Task added successfully",
            tasks: updatedTeam.tasks,
            task: updatedTeam.tasks[updatedTeam.tasks.length - 1],
            success: true,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteTeamTask=async (req, res) => {
    try {
        const { teamId, taskId } = req.query;

        if (!teamId || !taskId) {
            return res.status(400).json({ error: "Team ID and Task ID are required" });
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $pull: { tasks: { _id: taskId } } },
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(400).json({ error: "Team not found" });
        }

        return res.status(200).json({
            message: "Task deleted successfully",
            updatedTeam,
            success: true
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const teamTaskComplete=async (req, res) => {
    try {
        const { taskId, teamId, completed } = req.body;

        if (!teamId || !taskId) {
            return res.status(400).json({ error: "Team ID and Task ID are required" });
        }

        const updatedTeam = await Team.findOneAndUpdate(
            { _id: teamId, "tasks._id": taskId },
            { $set: { "tasks.$.completed": completed } },
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(400).json({ error: "Team not found" });
        }

        return res.status(200).json({ success: true, updatedTeam });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const teamEdit=async (req, res) => {
    try {
        const { teamId } = req.params;
        const { team } = req.body;

    

        const updatedTeam = await Team.findByIdAndUpdate(teamId, team, { new: true });

        if (!updatedTeam) return res.status(400).json({ error: "Group not found" });

        return res.status(200).json({ updatedTeam, success: true });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}