import User from "../../models/user/userModel.js";
import Task from '../../models/task/taskModel.js';
import Event from "../../models/event/eventModal.js";


export const getTaskOfUser=async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const tasks = await Task.find({ _id: { $in: user.tasks } });

        return res.status(200).json({ tasks, success: true });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const addTask=async (req, res) => {
    try {
        const { task, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "You are not logged in" });
        }
        // console.log(req.body);
        if (!task.title) {
            return res.status(400).json({ error: "Title cannot be empty" });
        }

        const newTask = new Task(task);
        await newTask.save();

        const event = new Event({
            title: task.title,
            User: userId,
            taskId: newTask._id,
        });

        await event.save();

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { tasks: newTask._id, events: event._id } },
            { new: true }
        );

        return res.status(201).json({ message: "Task added successfully", tasks: user.tasks, newTask, success: true });

    } catch (error) {
        // console.log(error)
        return res.status(500).json({ error: error.message });
    }
}

export const deleteTask=async (req, res) => {
    try {
        const { userId, taskId } = req.query;

        if (!userId || !taskId) {
            return res.status(400).json({ error: "User ID and Task ID are required" });
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(400).json({ error: "Task does not exist" });
        }

        // Remove the task from the user's tasks array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    tasks: taskId,
                    events: { taskId: taskId }
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ error: "User does not exist" });
        }

        // Delete associated events
        await Event.deleteMany({ taskId: taskId });

        return res.status(200).json({
            message: "Task and associated event(s) deleted successfully",
            tasks: updatedUser.tasks,
            success: true
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const updateTask=async (req, res) => {
    try {
        const { type, taskId, task, completed } = req.body;

        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        let updatedTask;
        if (type === "edit") {
            updatedTask = await Task.findByIdAndUpdate(taskId, task, { new: true });
        } else if (type === "checkbox") {
            updatedTask = await Task.findByIdAndUpdate(taskId, { completed }, { new: true });
            // console.log(updateTask)
        } else {
            return res.status(400).json({ error: "Invalid update type" });
        }

        if (!updatedTask) {
            return res.status(400).json({ error: "Task does not exist" });
        }

        return res.status(200).json({ message: "Task updated successfully", task: updatedTask, success: true });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}