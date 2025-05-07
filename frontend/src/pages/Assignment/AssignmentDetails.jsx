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
} from "@mui/material";
// import Auth from '../../components/Auth'
import { useNavigate, useParams } from "react-router-dom";
import CloudinaryUploadWidget from "../../components/CloudinaryUploadWidget";
import { useStore } from "../../store";

const AssignmentDetails = () => {
  const router = useNavigate();
  const { id } = useParams();
  const [assignment, setassignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [yo, setyo] = useState(false);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editedassignment, seteditedassignment] = useState(null);
  const { user,url } = useStore();
  console.log(id);
  const assignmentId = typeof id === "string" ? id : "";
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
        } catch (error) {
          console.error("Error fetching challenge details:", error);
        }
      };
      fetchAssignment();
    }
  }, [assignmentId]);

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
        } catch (error) {
          console.error("Error fetching submissions:", error);
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
    console.log(assignment);
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
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const res = await axios.patch(
          `${url}/api/assignment/editassignment?Id=${assignment?._id}`,config,
          editedassignment
        );
        console.log(res.data);
        seteditedassignment({
          title: "",
          description: "",
          AssignmentDoc: "",
          status: "Open",
          DueDate: new Date(),
          totalPoints: 0,
        });
        setErrorMessage("");
        setyo((prev) => !prev);
        handleClose();
      } catch (err) {
        console.log(err);
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
        `${url}/api/submission/approve-a-submission?Id=${id}`,config
      );
      console.log(response.data);
      setyo(!yo);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error while approving:", e);
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
      console.log(response.data);
      setyo(!yo);
    } catch (e) {
      console.error("Error while removing:", e);
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
      console.log(response.data);
      setyo(!yo);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error while approving:", e);
    }
  };

  const approveall = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.patch(
        `${url}/api/submission/approve-all-submission-assignment?Id=${assignmentId}`,config
      );
      console.log(response.data);
      setyo(!yo);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error while approving:", e);
    }
  };

  const handleUpload = (result) => {
    if (result && result.info) {
      seteditedassignment((prev) => ({
        ...prev,
        AssignmentDoc: result.info.url,
      }));
      console.log("Upload result info:", result.info);
    } else {
      console.error("Upload failed or result is invalid.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5">
      <div>
        <div className="flex justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-center">
              {assignment.title}
            </h1>
            <p className="text-gray-700 text-center">
              {assignment.description}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="mb-4">
              <span className="font-semibold">Frequency:</span>{" "}
              {assignment.status}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Points:</span>{" "}
              {assignment.totalPoints}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Start Date:</span>{" "}
              {new Date(assignment.DueDate || new Date()).toLocaleDateString()}
            </div>
            {assignment.AssignmentDoc && (
              <div className="mb-4">
                <span className="font-semibold">assignment Document:</span>{" "}
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
        <Button onClick={handleShow}>Edit assignment</Button>
        <button
          onClick={approveall}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Approve All Submissions
        </button>
        <h2 className="text-xl font-semibold mb-4">Submissions</h2>
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div
              key={submission._id}
              className="mb-2 flex justify-between p-4 border-b"
            >
              <div>
                <a
                  href={submission.documentLink}
                  className="text-blue-500 cursor-pointer"
                >
                  {" "}
                  Submission link{" "}
                </a>
              </div>
              <button
                className="mb-2 flex justify-between p-4 border-b"
                onClick={() => {
                  approve(submission._id);
                }}
              >
                Approve
              </button>
              <button
                className="mb-2 flex justify-between p-4 border-b"
                onClick={() => {
                  disapprove(submission._id);
                }}
              >
                Disapprove
              </button>
              <button
                className="mb-2 flex justify-between p-4 border-b"
                onClick={() => {
                  deletesub(submission._id);
                }}
              >
                Delete
              </button>
              <a
                onClick={() => router(`/Submission/${submission._id}`)}
                className="text-blue-500  cursor-pointer"
              >
                View Submission Details
              </a>
            </div>
          ))
        ) : (
          <p>No submissions found for this assignment.</p>
        )}

        <button
          onClick={() => router(`/admin/Courses`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to assignments
        </button>

        <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5">
          <Button onClick={handleShow}>Edit assignment</Button>

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
                value={
                  editedassignment?.DueDate
                    ? editedassignment.DueDate.toISOString().split("T")[0]
                    : ""
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
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
