import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import {
  Box,
  Tabs,
  Tab,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../../components/Layout"; 
import Settings from "./Settings"; 
// import Auth from "../../components/AdminAuth";
import toast from "react-hot-toast";
import { useStore } from "../../store.js"; 

function CustomTabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function GroupPage() {
  const [value, setValue] = useState(0);
  const { user ,url} = useStore();
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const { groupId } = useParams(); 
  // console.log(groupId)
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${url}/api/team/info/${groupId}?type=Team`,config);
        console.log(groupId)
        setTasks(res.data.team.tasks);
      } catch (e) {
        toast.error(e.response?.data?.error || "Error fetching team");
      }
    };
    fetchTeam();
  }, [groupId]);

  const addTask = async () => {
    try {
      const { data } = await axios.post(`${url}/api/team/tasks`, {
        task: { text: newTask, completed: false },
        userId: user?._id,
        teamId: groupId,
      },config);
      if (data.success) {
        setTasks([...tasks, { text: newTask, completed: false, _id: data.task._id }]);
        setNewTask("");
      }
    } catch (e) {
      toast.error(e.response?.data?.error || "Error adding task");
    }
  }; 

  const toggleComplete = async (currTask) => {
    try {
      await axios.put(`${url}/api/team/tasks`, {
        taskId: currTask._id,
        teamId: groupId,
        completed: !currTask.completed,
      },config);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === currTask._id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (e) {
      toast.error(e.response?.data?.error || "Error updating task");
    }
  };

  const deleteTask = async (id) => {
    try {
      const { data } = await axios.delete(`${url}/api/team/tasks`, {
        params: { teamId: groupId, taskId: id },
        ...config
      });
      if (data.success) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      }
    } catch (e) {
      toast.error(e.response?.data?.error || "Error deleting task");
    }
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={(_, newValue) => setValue(newValue)} aria-label="tabs">
            <Tab label="Group Tasks" {...a11yProps(0)} />
            <Tab label="Settings" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <div className="text-center w-full text-2xl font-bold mt-4 mb-6 mx-4">
            Start collaborating with your group right away!
          </div>
          <Container maxWidth="sm">
            <div className="flex">
              <TextField
                sx={{ width: "80%", marginLeft: "1rem" }}
                variant="outlined"
                label="New Task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={addTask}
                sx={{ marginX: "10px", height: "55px" }}
              >
                +
              </Button>
            </div>

            <List>
              {tasks.map((task, index) => (
                <ListItem key={index}>
                  <Checkbox checked={task.completed} onClick={() => toggleComplete(task)} />
                  <ListItemText
                    primary={task.text}
                    style={{ textDecoration: task.completed ? "line-through" : "none" }}
                  />
                  <IconButton edge="end" onClick={() => deleteTask(task._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Container>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Settings />
        </CustomTabPanel>
      </Box>
    </Layout>
  );
}

export default GroupPage;
