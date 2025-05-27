import React, { useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useStore } from '../store';
import toast, { Toaster } from 'react-hot-toast';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom'; 
import { Paper } from '@mui/material';
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Dashboard = () => {
  const router = useNavigate()
  const { user, setUser ,url} = useStore()
  const [courses, setCourses] = useState([])
  const [pendingassignment, setpendingassignment] = useState(null);
  const [taskInput, setTaskInput] = useState({ title: "", color: "", course: "", dueDate: "", completed: false })
  const [editInput, setEditInput] = useState({ title: "", color: "", course: "", dueDate: "" })
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = React.useState(false);
  // const [age, setAge] = React.useState('');
  const [progress, setProgress] = useState(0)
  const [selected, setSelected] = useState(null)
  const [dueTodayCount, setDueTodayCount] = useState(0);
  const [loading,setLoading]=useState(false);

 
  const handleOpen = (task) => {
    setSelected(task)
    // console.log(task)
    setEditInput({
      title:task.title,
      color:task.color,
      course:task.course,
      dueDate:task.dueDate,
    });
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  // console.log("Config",config);
 
  // Function to calculate the number of tasks due today
  const calculateDueTodayCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = tasks.filter((task) => {
      const dueDate = new Date(task?.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return ((dueDate.getTime() === today.getTime()) && !task?.completed);
    }).length;

    setDueTodayCount(count);
  };

  // useEffect to recalculate due today count on tasks change
  useEffect(() => {
    calculateDueTodayCount();
  }, [tasks]);


  // console.log(user.token);

      const fetchTasks = async () => {
      try {
        
        const { data } = await axios.get(`${url}/api/task?userId=${user._id}`,config);
        

      
          setTasks(data.tasks)
          if (data.tasks.length > 0) {
            let len = data.tasks.length
            let array = data.tasks.filter((task) => task?.completed == true)
            setProgress(Math.round(array.length * 100 * 100 / len) / 100)
          } else setProgress(0)
      

          console.log(data);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error)
      }
    }

  useEffect(() => {

    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${url}/api/course?userId=${user?._id}`,config)
        console.log(data);
        if (data.success) {
          setCourses(data.courses)
        }

        console.log(data);
      } catch (error) {
        toast.error("Error fetching courses:", error.response.data.message);
      }
    }

    // console.log(user,url)
    const fectchpendingassignments = async () => {
      try {
        console.log(config);
        const res = await axios.get(`${url}/api/assignment/getpendingassignments-of-user?userId=${user?._id}`,config)
        console.log(res);
        setpendingassignment(res.data.data)
      }
      catch (err) {
        toast.error(err.response.data.message)
      }
    }
    fetchTasks()
    fetchCourses()
    fectchpendingassignments()
    setLoading(true)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInput(prev => ({ ...prev, [name]: value }));
  };

  // EDIT TASK INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditInput(prev => ({ ...prev, [name]: value }));
  };


  const handleAddTask = async () => {
    try {
      console.log(taskInput);
      const { data } = await axios.post(`${url}/api/task`, { task:taskInput, userId: user?._id },config)

      if (data.success) {
        const newTasks = [...tasks, data.newTask];
        setTasks(newTasks);

        // Recalculate progress after adding a task
        const completedTasksCount = newTasks.filter(task => task?.completed).length;
        setProgress(Math.round((completedTasksCount / newTasks.length) * 100));

        // Reset task input
        setTaskInput({ title: "", color: "", course: "", dueDate: "", completed: false });
        fetchTasks();

      } else {
        toast.error(data.error || "Task addition failed")
      }
    } catch (error) {
      toast.error(error.response.data.error)
    }
  };


  const handleCheckboxChange = async (taskId, completed) => {
    try {
      const { data } = await axios.patch(`${url}/api/task`, { taskId, completed: !completed, type: "checkbox" },config);
      if (data.success) {
        // Update local task state
        const updatedTasks = tasks.map((task) =>
          task?._id === taskId ? { ...task, completed: !task?.completed } :null
        );

        fetchTasks();

        // setTasks(updatedTasks);

        // Recalculate progress based on the updated tasks
        const completedTasksCount = updatedTasks.filter(task => task?.completed).length;
        setProgress(Math.round((completedTasksCount / updatedTasks.length) * 100));

      } 
    } catch (e) {
      console.log(e);
      toast.error("Error updating task:", e.response)
    }
  };


  const handleEditTask = async (id,task) => {
    try {
      const { data } = await axios.put(`${url}/api/task`, { taskId: id, task: editInput, type: "edit",completed:task.completed },config)

      if (data.success) {
        setEditInput({ title: "", color: "", course: "", dueDate: "" });
        
        const updatedTasks = tasks.map((task) => task?._id == data.task?._id ? data.task:null )
       
        setTasks(updatedTasks)

        fetchTasks();
       
        handleClose()
      } 
    } catch (error) {
      toast.error(error.response.data.error)
    }
  };


  const handleDeleteTask = async (id) => {
    try {
      const { data } = await axios.delete(`${url}/api/task`, { params: { taskId: id, userId: user?._id } },config)
      if (data.success) {
        setEditInput({ title: "", color: "", course: "", dueDate: "" });

        const taskArray = tasks.filter((task) => task?._id !== id);
        setTasks(taskArray);

        // Recalculate progress after deleting a task
        const completedTasksCount = taskArray.filter((task) => task?.completed).length;
        setProgress(Math.round((completedTasksCount / taskArray.length) * 100));
        fetchTasks();
        handleClose()

      } 
    } catch (error) {
      toast.error("Error deleting task:", error.response.data.error);
    }
  };
    
  return (
    <div>
      <Layout>
        <div className='flex gap-2 justify-space-between items-center w-full max-h-screen h-screen bg-gradient-to-r from-blue-200 to-cyan-200'>
          <div className='tasks w-1/2 h-[90%] mx-4'>
            <div className='m-2 bg-white w-full rounded-md p-4 flex justify-between text-slate-800 font-bold text-xl'>
              <div>
                <div>Hi { user?.username}</div>
                <div>{dueTodayCount} Tasks due today</div>
              </div>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={progress} size="60px" />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ color: 'text.secondary' }}
                  >{`${progress}%`}</Typography>
                </Box>
              </Box>
            </div>
            <Box className="w-full flex flex-col gap-4">
      {/* Task Input Section */}
      <Paper className="p-4 w-full shadow-md">
        <TextField
          fullWidth
          label="Add Task"
          name="title"
          value={taskInput.title}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
        />

        <Box className="flex justify-between items-center mt-4">
          {/* Course Selection */}
          <FormControl size="small" className="w-1/3">
            <InputLabel>Select Course</InputLabel>
            <Select name="course" value={taskInput.course} onChange={handleInputChange}>
              <MenuItem value="" disabled>Select Course</MenuItem>
              {courses?.map((course) => (
                <MenuItem key={course._id.toString()} value={course.name}>{course.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Color Selection */}
          <FormControl size="small" className="w-1/4">
            <InputLabel>Select Color</InputLabel>
            <Select name="color" value={taskInput.color} onChange={handleInputChange}>
              <MenuItem value="border-l-black">⚫ Black</MenuItem>
              <MenuItem value="border-l-red-400">🔴 Red</MenuItem>
              <MenuItem value="border-l-yellow-400">🟡 Yellow</MenuItem>
              <MenuItem value="border-l-green-400">🟢 Green</MenuItem>
              <MenuItem value="border-l-purple-400">🟣 Purple</MenuItem>
              <MenuItem value="border-l-blue-400">🔵 Blue</MenuItem>
            </Select>
          </FormControl>

          {/* Due Date Selection */}
          <TextField
            type="date"
            name="dueDate"
            value={taskInput.dueDate}
            onChange={handleInputChange}
            size="small"
            className="w-1/4"
          />

          {/* Add Task Button */}
          <IconButton color="primary" onClick={handleAddTask}>
            <AddIcon />
          </IconButton>
        </Box>
      </Paper>

          {/* Tasks List */}
          <Box className="tasks-container h-96 overflow-y-auto w-full">
            {tasks.map((task) => (
              <Paper
                key={task?._id.toString()}
                className={`border-l-8 ${(task)?task?.color:'blue'} p-3 my-2 mx-1 shadow-md rounded-lg flex flex-col gap-2`}
              >
                {/* Task Header */}
                <Box className="flex items-center justify-between">
                  <Checkbox checked={task?.completed} onChange={() => handleCheckboxChange(task?._id, task?.completed)} />
                  <Typography
                    variant="h6"
                    className={`w-96 truncate ${task?.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                  >
                    {(task)?task?.title:"No Title"}
                  </Typography>
                  <IconButton onClick={() => handleOpen(task)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                {/* Task Meta Info */}
                <Box className="flex justify-between items-center mx-6">
                  {task?.course && <Chip label={task?.course} color="primary" />}
                  {task?.dueDate && (
                    <Typography variant="body2" color="textSecondary">
                      Due {new Date(task?.dueDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                    </Typography>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
         

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <TextField id="standard-basic" label="" variant="standard" sx={{ width: "100%" }} value={editInput.title} onChange={(e) => setEditInput({ ...editInput, title: e.target.value })} />
                <div className='flex'>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 100, color: "black" }}>
                    <InputLabel id="demo-simple-select-standard-label">Course</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Color"
                      value={editInput.course}
                      onChange={(e) => setEditInput({ ...editInput, course: e.target.value })}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {courses?.map((course )=> (
                        <MenuItem value={course.name}>{course.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120, color: "black" }}>
                    <InputLabel id="demo-simple-select-standard-label">Color</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Color"
                      value={editInput.color}
                      onChange={(e) => setEditInput({ ...editInput, color: e.target.value })}
                    >
                      <MenuItem value="border-l-black">⚫ Black</MenuItem>
                      <MenuItem value="border-l-red-400">🔴 Red</MenuItem>
                      <MenuItem value="border-l-yellow-400">🟡 Yellow</MenuItem>
                      <MenuItem value="border-l-green-400">🟢 Green</MenuItem>
                      <MenuItem value="border-l-purple-400">🟣 Purple</MenuItem>
                      <MenuItem value="border-l-blue-400">🔵 Blue</MenuItem>
                    </Select>
                  </FormControl>
                  <input
                    type='date'
                    name="dueDate"
                    value={editInput.dueDate ? new Date(editInput.dueDate).toISOString().substring(0, 10) : ""}
                    onChange={(e) => setEditInput({ ...editInput, dueDate: e.target.value })}
                    className='p-1 rounded-md'
                  ></input>
                </div>
                <TextField
                  id="standard-multiline-static"
                  label="Description"
                  multiline
                  rows={4}
                  defaultValue={selected ? selected.description : ""}
                  variant="standard"
                  sx={{ width: 400 }}
                />
                <div className='flex justify-between my-4'>
                  <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteTask(selected?._id)}>
                    Delete
                  </Button>
                  <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditTask(selected?._id,selected)}>
                    Edit
                  </Button>
                </div>

              </Box>
            </Modal>
          </div>
          <Paper
              elevation={3}
              sx={{
                ml: 2,
                mt: 4,
                mr: 4,
                width: "50%",
                height: "90%",
                overflowY: "auto",
                p: 4,
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" fontWeight="bold" textAlign="center" color="text.primary" mb={2}>
                Pending Assignments
              </Typography>

              {pendingassignment?.length > 0 ? (
                <Stack spacing={2}>
                  {pendingassignment.map((assignment) => (
                    <Paper
                      key={assignment._id}
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 2, cursor: "pointer", "&:hover": { boxShadow: 3 } }}
                      onClick={() => router(`/Assignment/user/${assignment._id}`)}
                    >
                      <Typography variant="subtitle1" fontWeight="600">
                        {assignment.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Due Date:{" "}
                        {new Date(assignment.DueDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        Description: {assignment.description}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No pending assignments
                </Typography>
              )}
            </Paper>
          <Toaster />
        </div>
      </Layout>
    </div>
  )
}

export default Dashboard