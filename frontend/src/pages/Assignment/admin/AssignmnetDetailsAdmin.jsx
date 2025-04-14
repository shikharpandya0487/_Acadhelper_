import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  LinearProgress,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import Auth from '../../../components/Auth'
import Layout from "../../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import CloudinaryUploadWidget from "../../../components/CloudinaryUploadWidget";
import { useStore } from "../../../store";

const AssignmentDetailsAdmin = () => {
  const router = useNavigate();
  const { id } = useParams();
  const [assignment, setassignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [yo, setyo] = useState(false);
  const [show, setShow] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [bonus, setBonus] = useState(0);
  const [deduct, setDeduct] = useState(0);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [editedassignment, seteditedassignment] = useState(null);
  const assignmentId = typeof id === "string" ? id : "";
  const {user,url}=useStore();

  useEffect(() => {
    if (assignmentId) {
      const fetchAssignment = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const response = await axios.get(
            `${url}/api/assignment/getassignmentById?Id=${assignmentId}`,config
          );
          setassignment(response.data.data);
          toast.success("Fetched the challenge details");
        } catch (error) {
          toast.error(error.response.data.error);
        }
      };
      fetchAssignment();
    }
  }, [assignmentId,yo]);

  useEffect(() => {
    if (assignmentId) {
      const fetchSubmissions = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const submissionsResponse = await axios.get(
            `${url}/api/submission/getsubmissionbyassignment?assignmentId=${assignmentId}`,config
          );
          setSubmissions(submissionsResponse.data.data);
          console.log(submissionsResponse.data);
          toast.success("Fetched the submissions");
        } catch (error) {
          toast.error(error.response.data.error);
        }
      };
      fetchSubmissions();
    }
  }, [assignmentId, yo]);

  const handleClose = () => {
    setShow(false);
    setErrorMessage("");
  };

  const handleShow = () => {
    setShow(true);
    seteditedassignment({
      title: assignment?.title || "",
      description: assignment?.description || "",
      DueDate: assignment?.DueDate || new Date(),
      AssignmentDoc: assignment?.AssignmentDoc || "",
      totalPoints: assignment?.totalPoints || 0,
      status: assignment?.status || "Open",
    });
  };

  const handleEdit = async () => {
    const submitbutton = async () => {
      try {
        if (
          editedassignment?.title === "" ||
          editedassignment?.description === "" ||
          editedassignment?.AssignmentDoc === "" ||
          (editedassignment?.status !== "Open" &&
            editedassignment?.status !== "Graded" &&
            editedassignment?.status !== "Closed")
        ) {
          setErrorMessage("All entries should be filled");
          toast.error("All entries much be filled");
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const res = await axios.patch(
          `${url}/api/assignment/editassignment?Id=${assignment?._id}`,
          editedassignment,config
        );
        seteditedassignment({
          title: "",
          description: "",
          AssignmentDoc: "",
          status: "Open",
          DueDate: new Date(),
          totalPoints: 0,
        });
        
        console.log(res);
        setErrorMessage("");
        setyo((prev) => !prev);
        handleClose();
        toast.success("Edited successfully");
      } catch (error) {
        toast.error(error.response.data.error);
      }
    };
    submitbutton();
  };

  const approve = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.patch(
        `${url}/api/submission/approve-a-submission?Id=${id}`,{},config
      );
      setyo(!yo);
      toast.success("Approved");
      console.log(response)
    } catch (e) {
      console.log(e);
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const deletesub = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.patch(
        `${url}/api/submission/remove-submission?Id=${id}`,config
      );
      setyo(!yo);
      console.log(response);
      toast.success("Deleted the submission");
    } catch (e) {
      toast.error("Error while deleting the submission");
    }
  };

  const disapprove = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.patch(
        `${url}/api/submission/disapprove-submission?Id=${id}`,config
      );
      setyo(!yo);
      toast.success("Disapproved successfully");
    } catch (e) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleOpenModal = (submissionId) => {
    setSelectedSubmissionId(submissionId);
    setShowmodal(true);
  };

  const handleCloseModal = () => {
    setShowmodal(false);
    setBonus(0);
    setDeduct(0);
  };

  const bonusPoints = async () => {
    if (!selectedSubmissionId) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.patch(
        `${url}/api/submission/bonus-points?Id=${selectedSubmissionId}`,config,
        { bonus }
      );
      setyo(!yo);
      console.log(response.data);
      toast.success("Bonus points awarded successfully!");
    } catch (e) {
      toast.error(e);
    }
    handleCloseModal();
  };

  const deductPoints = async () => {
    if (!selectedSubmissionId) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.patch(
        `${url}/api/submission/deduct-points?Id=${selectedSubmissionId}`,config,
        { deduct }
      );
      setyo(!yo);
      console.log("Deduct",response.data);
      toast.success("Points deducted successfully!");
    } catch (error) {
      toast.error(error.response.data.error);
    }
    handleCloseModal();
  };

  const approveall = async () => {
    try {
        if (!user || !user.token) {
            toast.error("User not authenticated. Please log in again.");
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const response = await axios.patch(
            `${url}/api/submission/approve-all-submission-assignment?Id=${assignmentId}`,
            {},  // Empty object as PATCH requires a body
            config
        );

        setyo(!yo);
        console.log("Approval Response:", response.data);
        toast.success("Approved all");

    } catch (e) {
        console.error("Error Approving Submissions:", e);
        toast.error(e.response?.data?.message || "An unexpected error occurred. Please try again.");
    }
};


  const handleUpload = (result) => {
    if (result && result.info) {
      seteditedassignment((prev) => ({
        ...prev,
        AssignmentDoc: result.info.url,
      }));
      toast.success("Uploaded result");
    } else {
      toast.error("Upload failed");
    }
  };
  // console.log(editedassignment ? new Date(editedassignment.DueDate).toISOString().split("T")[0] : "");

  if (!assignment)
    return (
      <Layout>
        <LinearProgress />
      </Layout>
    );

  return (
    <Layout>
      <div className=" bg-gray-100 min-h-screen p-10">
        <div>
          <button
            onClick={() => router(`/admin/Courses/${assignment.Course}`)}
            className="mb-4 text-blue-400 rounded hover:bg-blue-100 transition"
          >
            <ArrowBackIosNewIcon />
          </button>
          <div className="flex justify-between mb-6">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold w-[50vw] break-words">
                Title: {assignment.title}
              </h1>
              <p className="text-gray-700 m-1 w-[50vw] break-words">
                Description: {assignment.description}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="mb-4">
                <span className="font-semibold">Frequency :</span>{" "}
                {assignment.status}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Points :</span>{" "}
                {assignment.totalPoints}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Due Date :</span>{" "}
                {new Date(
                  assignment.DueDate || new Date()
                ).toLocaleDateString()}
              </div>
              {assignment.AssignmentDoc && (
                <div className="mb-4">
                  <span className="font-semibold">Assignment :</span>{" "}
                  <a
                    href={assignment.AssignmentDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end w-full">
            <Button
              variant="outlined"
              onClick={handleShow}
              sx={{ marginX: "10px" }}
            >
              Edit assignment
            </Button>
            <Button
              color="success"
              variant="outlined"
              onClick={approveall}
              className=""
            >
              Approve All Submissions
            </Button>
          </div>
          <h2 className="text-xl font-semibold mb-4">Submissions</h2>

          {submissions.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Submission Link</TableCell>
                    <TableCell align="center">
                      View Submission Details
                    </TableCell>
                    <TableCell align="left">Approve</TableCell>
                    <TableCell align="left">Disapprove</TableCell>
                    <TableCell align="left">Delete</TableCell>
                    <TableCell align="center">Deduct/Bonus</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow
                      key={submission._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <a
                          href={submission.documentLink}
                          className="text-blue-500 cursor-pointer"
                        >
                          {" "}
                          Submission link{" "}
                        </a>
                      </TableCell>
                      <TableCell align="center">
                        <a
                          onClick={() =>
                            router(`/Submission/${submission._id}`)
                          }
                          className="text-blue-500  cursor-pointer"
                        >
                          Submission Details
                        </a>
                      </TableCell>
                      <TableCell align="right">
                        <button
                          className="mb-2 flex justify-between p-4 text-green-400"
                          onClick={() => {
                            approve(submission._id);
                          }}
                        >
                          <ThumbUpIcon />
                        </button>
                      </TableCell>
                      <TableCell align="right">
                        <button
                          className="mb-2 flex justify-between p-4 text-red-500"
                          onClick={() => {
                            disapprove(submission._id);
                          }}
                        >
                          <ThumbDownIcon />
                        </button>
                      </TableCell>
                      <TableCell align="right">
                        <button
                          className="mb-2 flex justify-between p-4"
                          onClick={() => {
                            deletesub(submission._id);
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => {
                            handleOpenModal(submission._id);
                          }}
                          variant="outlined"
                        >
                          Deduct/Bonus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No submissions found for this assignment.</p>
          )}

          <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5">
            <Dialog open={show} onClose={handleClose}>
              <DialogTitle>Edit assignment</DialogTitle>
              <DialogContent>
                <TextField
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={editedassignment?.title || ""}
                  onChange={(e) =>
                    seteditedassignment((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  value={editedassignment?.description || ""}
                  onChange={(e) =>
                    seteditedassignment((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Points"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={editedassignment?.totalPoints || 0}
                  onChange={(e) =>
                    seteditedassignment((prev) => ({
                      ...prev,
                      totalPoints: parseInt(e.target.value, 10),
                    }))
                  }
                />
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  margin="normal"
                  value={(editedassignment)?
                    new Date(editedassignment.DueDate).toISOString().split("T")[0]:null
                      
                  }
                  onChange={(e) =>
                    seteditedassignment((prev) => ({
                      ...prev,
                      DueDate: new Date(e.target.value),
                    }))
                  }
                />
                {editedassignment?.AssignmentDoc && (
                  <div className="mb-4">
                    <span className="font-semibold">Current Document:</span>{" "}
                    <a
                      href={editedassignment.AssignmentDoc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View Document
                    </a>
                  </div>
                )}
                <CloudinaryUploadWidget
                  cloud_name="dc2ztcjs0"
                  upload_preset="r99tyjot"
                  handleUpload={handleUpload}
                />
                <TextField
                  label="Type"
                  select
                  fullWidth
                  margin="normal"
                  value={editedassignment?.status || "Open"}
                  onChange={(e) =>
                    seteditedassignment((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Graded">Graded</MenuItem>
                </TextField>
                {errorMessage && (
                  <p className="text-red-500 mt-2">{errorMessage}</p>
                )}
              </DialogContent>
              <DialogActions>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleEdit} color="primary">
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={showmodal} onClose={handleCloseModal}>
              <DialogTitle>Deduct/Bonus Points</DialogTitle>
              <DialogContent>
                <TextField
                  label="Bonus Points"
                  type="number"
                  fullWidth
                  value={bonus}
                  onChange={(e) => setBonus(Number(e.target.value))}
                  margin="dense"
                />
                <TextField
                  label="Deduct Points"
                  type="number"
                  fullWidth
                  value={deduct}
                  onChange={(e) => setDeduct(Number(e.target.value))}
                  margin="dense"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} color="secondary">
                  Cancel
                </Button>
                <Button onClick={bonusPoints} color="primary">
                  Add Bonus
                </Button>
                <Button onClick={deductPoints} color="primary">
                  Deduct Points
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignmentDetailsAdmin;
