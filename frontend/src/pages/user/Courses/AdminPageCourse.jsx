import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Tabs from '@mui/material/Tabs';
import toast, { Toaster } from 'react-hot-toast';
// import Auth from '@/components/Auth'
import Tab from '@mui/material/Tab';
import { useStore } from "../../../store";
// import { CldUploadWidget } from 'next-cloudinary';
import { Box, Button, TextField, Typography, Modal, IconButton, Select, MenuItem, Chip } from "@mui/material";
import Leaderboard from "../../../components/Leaderboard";
import Layout from "../../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";

function sortUsersByCoursePoints(users, targetCourseId) {
  return users.sort((a, b) => {
    const aPoints = a.Totalpoints.find((course) => course.courseId === targetCourseId)?.points || 0;
    const bPoints = b.Totalpoints.find((course) => course.courseId === targetCourseId)?.points || 0;
    return bPoints - aPoints;
  });
}
const AdminPageCourse = () => {
  const router = useNavigate();
  const { id } = useParams();
  const [challenges, setChallenges] = useState([]);
  const [assignments, setassignments] = useState([]);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [openAssignment, setopenAssignment] = useState(false);
  const [challengeIdToDelete, setChallengeIdToDelete] = useState(null);
  const [AssignmentIdToDelete, setAssignmentIdToDelete] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [challengeDoc, setChallengeDoc] = useState("");
  const [type, setType] = useState("individual");
  const [frequency, setFrequency] = useState("daily");
  const [points, setPoints] = useState();
  const [submissions, setSubmissions] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openUploadAssignmentModal, setOpenUploadAssignmentModal] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentDoc, setAssignmentDoc] = useState("");
  const [assignmentPoints, setAssignmentPoints] = useState();
  const [yo, setyo] = useState(false)
  const courseId = id
  const { user, setUser,url } = useStore()
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [enrolledUsers,setEnrolledUsers] = useState([])

  // Get all users in a course
  useEffect(()=>{
    const fetchEnrolledUsers=async ()=>{
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response=await axios.get(`${url}api/course/get-enrolled`,{
          params:{
            courseId
          }
        },config)
        
        const sortedUsers = sortUsersByCoursePoints(response.data.users, courseId);
        setEnrolledUsers(sortedUsers)
    
      } catch (error) {
        toast.error(error.response.data.error);
        return;
    }
    }
    fetchEnrolledUsers()
  },[])


  const handleUpload = (result) => {
    if (result && result.info) {
      setAssignmentDoc(result.info.url);
    } else {
      toast.error(`Upload failed or result is invalid.`);
    }
  };

  const handleUploadChallenge =(result)=>{
    if (result && result.info) {
      setChallengeDoc(result.info.url);
    } else {
      toast.error("Upload failed or result is invalid.");
    }
  }

  const handleSubmitChallenge = async () => {
    try {
      let End = new Date(startDate);
      if (frequency === "daily") {
        End.setDate(End.getDate() + 1)
      }
      if (frequency === "weekly") {
        End.setDate(End.getDate() + 7)
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(`${url}/api/challenge/uploadchallenge`, {
        title,
        description,
        startDate,
        endDate: End.toISOString().split('T')[0],
        challengeDoc,
        type,
        frequency,
        points,
        createdBy: user?._id,
        courseId,
      },config);
      setChallenges((prev) => [...prev, response.data.Challenge]);
      setOpenUploadModal(false);
      setyo(!yo)
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleSubmitAssignment = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(`${url}/api/assignment/upload-assignment`,config, {
        title: assignmentTitle,
        description: assignmentDescription,
        DueDate: assignmentDueDate,
        AssignmentDoc: assignmentDoc,
        totalPoints: assignmentPoints,
        CourseId: courseId,
        uploadedAt: Date.now(),
        status: "Open"
      });
      setOpenUploadAssignmentModal(false);
      setyo(!yo)
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const fetchChallenges = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`${url}/api/challenge/getchallengebycourse?CourseId=${courseId}`,config);
      setChallenges(response.data.data);
    } catch (error) {
      toast.error(error.response.data.error)
    }
  };


  const fetchAssignments = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`${url}/api/assignment/getassignmentsbycourse/${id}`,config);
      setassignments(response.data.data);
    } catch (error) {
      toast.error(error.response.data.error)
    }
  };
  const DeleteChallenge = async () => {
    if (challengeIdToDelete) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response = await axios.delete(`${url}/api/challenge/deletechallenge?Id=${challengeIdToDelete}`,config);
        setChallenges((prev) => prev.filter(challenge => challenge._id !== challengeIdToDelete));
        handleCloseModal();
      } catch (error) {
        toast.error(error.response.data.error);
      }
    }
  };
  const DeleteAssignment = async () => {
    if (AssignmentIdToDelete) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response = await axios.delete(`${url}/api/assignment/delete-assignment?Id=${AssignmentIdToDelete}`,config);
        setassignments((prev) => prev.filter(assignment => assignment._id !== AssignmentIdToDelete));
        handleCloseAssignmentModal();
      } catch (error) {
        toast.error(error.response.data.error);
      }
    }
  };
  const GetsubmissionBycourse = async () => {
    if (courseId) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response = await axios.get(`${url}/api/submission/getsubmissionbycourseanduser?CourseId=${courseId}&userId=${user?._id}`,config);
        setSubmissions(response.data.data)
      } catch (error) {
        toast.error(error.response.data.error);
      }
    }
  };

  const handleOpenModal = (id) => {
    setChallengeIdToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setChallengeIdToDelete(null);
  };
  const handleOpenAssignmentModal = (id) => {
    setAssignmentIdToDelete(id);
    setopenAssignment(true);
  };

  const handleCloseAssignmentModal = () => {
    setopenAssignment(false);
    setAssignmentIdToDelete(null);
  };

  useEffect(() => {
    fetchChallenges();
    fetchAssignments();
    GetsubmissionBycourse();
  }, [courseId, yo]);

  const handleChallengeClick = (challengeId) => {
    router(`/Challenge/${challengeId}`);
  };

  return (
    <Layout>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Assignments" />
          <Tab label="Challenges" />
          <Tab label="Leaderboard" />
          <Tab label="My submissions" />
        </Tabs>
        {value === 0 && (
          <>
            <div className="">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                     <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] m-6 cursor-pointer"  onClick={() => router(`/Assignment/user/${assignment._id}`)}>
                         <h1 className="text-3xl font-bold mb-4 flex justify-between">
                          {assignment.title}
                          <div>
                           <Chip label={assignment.status} sx={{marginRight:"1rem"}} color={assignment.status=='Open' ? "success" : "error"} variant="outlined"/>
                           <Chip label={assignment.totalPoints} />
                           </div>
                          </h1>
                         <p><strong>Assigned on:</strong> {new Date(assignment.uploadedAt).toISOString().split("T")[0]}</p>
                         <p><strong>Due date:</strong> {assignment.DueDate? new Date(assignment.DueDate).toISOString().split("T")[0] :"N/A" }</p>
                     </div>
                ))
              ) : (
                <div className="w-full flex justify-center">No assignments found for this course.</div>
              )}
            </div>
          </>
        )}

        {value === 1 && (
          <>
            <Box sx={{ mt: 2 }}>
              {challenges.length > 0 ? (
                challenges.map((challenge) => (
                  <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] m-6 cursor-pointer" onClick={() => router(`/Challenge/user/${challenge._id}`)}>
                  <h1 className="text-3xl font-bold mb-4 flex justify-between">
                   {challenge.title}
                   <div>
                    <Chip label={challenge.type} sx={{marginRight:"1rem"}} color="secondary" variant="outlined"/>
                    <Chip label={challenge.frequency} sx={{marginRight:"1rem"}} color={challenge.frequency=='daily' ? "primary" : "success"} variant="outlined"/>
                    <Chip label={challenge.points} />
                    </div>
                   </h1>
                  <p><strong>Start date:</strong> {new Date(challenge.startDate).toISOString().split("T")[0]}</p>
                  <p><strong>Due date:</strong> {new Date(challenge.endDate).toISOString().split("T")[0]}</p>
              </div>
                ))
              ) : (
                <div className="w-full flex justify-center">No challenges found for this course.</div>
              )}
            </Box>

          </>
        )}

        {value === 2 && (
          <>
          <div className="text-center ">
          <Leaderboard users={enrolledUsers}/>
          </div>
          </>
        )}

        {value === 3 && (
          <>
            <Box >
              <div className="mt-10">
                    <h2 className="text-2xl font-bold m-4">Submissions</h2>
                    {submissions.length > 0 ? (
                        submissions.map((submission) => (
                            <div key={submission._id} className="bg-white rounded-lg shadow-lg p-6 w-[95%] m-6 cursor-pointer">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                                    </div>
                                    <a href={submission.documentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        View Submission
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 m-4">No submissions yet.</p>
                    )}
                </div>
            </Box>
          </>
        )}
        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              p: 4,
              outline: 'none',
              zIndex: 1300,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
              Confirm Delete
            </Typography>
            <Typography id="modal-description" sx={{ mb: 4 }}>
              Are you sure you want to delete this challenge?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal} color="primary" sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button onClick={DeleteChallenge} variant="contained" color="secondary">
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>


        <Modal
          open={openAssignment}
          onClose={handleCloseAssignmentModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              p: 4,
              outline: 'none',
              zIndex: 1300,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
              Confirm Delete
            </Typography>
            <Typography id="modal-description" sx={{ mb: 4 }}>
              Are you sure you want to delete this assignment?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseAssignmentModal} color="primary" sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button onClick={DeleteAssignment} variant="contained" color="secondary">
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Layout>
  );
};

export default AdminPageCourse;