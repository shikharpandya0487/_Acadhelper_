import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Skeleton,
  LinearProgress,
} from "@mui/material";
import { useStore } from "../../../store";
// import Auth from '../../../components/Auth'
import Layout from "../../../components/Layout";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloudinaryUploadWidget from "../../../components/CloudinaryUploadWidget";

const AssignmentDetailsUser = () => {
  const router = useNavigate();
  const { user, setUser, url } = useStore();
  const { id } = useParams();
  const [assignmentDoc, setAssignmentDoc] = useState("");
  const [assignment, setassignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [yo, setyo] = useState(false);
  const [isDocVisible, setIsDocVisible] = useState(false);
  const [show, setShow] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [editedassignment, seteditedassignment] = useState(null);
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
          toast.success("Fetched assignments");
        } catch (error) {
          toast.error("Error fetching the assignments");
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
            `${url}/api/submission/getsubmissionbyassignmentanduser?assignmentId=${assignmentId}&userId=${user?._id}`,config
          );
          setSubmissions(submissionsResponse.data.data);
          toast.success("Successfully fetched Submissions");
        } catch (error) {
          toast.error("Error fetching submission");
        }
      };
      fetchSubmissions();
    }
  }, [assignmentId, yo]);

  const deletesub = async (id) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const response = await axios.patch(
            `${url}/api/submission/remove-submission?Id=${id}`, {},config 
        );

        setyo(!yo);
        toast.success("Deleted Submission");

    } catch (error) {
        console.error("Error deleting submission:", error);
        toast.error(error.response?.data?.error || "An error occurred");
    }
};


  const handleEditsub = async (id) => {
    const submitwala = {
      documentLink: assignmentDoc,
    };
    if (!assignmentDoc) toast.error("Select file first");
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
      const response = await axios.patch(
        `${url}/api/submission/edit-submission?id=${id}`,
        submitwala,config
      );
      setAssignmentDoc("");
      setIsDocVisible(false);
      setyo(!yo);
      toast.success("Edited submission");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };
  const handlesub = async () => {
    const submitwala = {
      user: user?._id,
      assignment: assignmentId,
      documentLink: assignmentDoc,
      courseId: assignment?.Course,
    };
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
      const response = await axios.post(`${url}/api/submission`,submitwala,config);
      setAssignmentDoc("");
      setIsDocVisible(false);
      setyo(!yo);
      toast.success("Made submission successfully");
    } catch (error) {
      console.log(error.response)
      toast.error(error.response.data.error);
    }
  };

  const handleUpload = (result) => {
    if (result && result.info) {
      setAssignmentDoc(result.info.url);
      setIsDocVisible(true);
      toast.success("Upload successful");
    } else {
      toast.error("Upload failed or result is invalid.");
    }
  };

  if (!assignment)
    return (
      <Layout>
        <LinearProgress />
      </Layout>
    );
  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-10 px-5">
        <button
          onClick={() => router(`/user/Courses/${assignment.Course}`)}
          className="mx-4 text-blue-400 rounded hover:bg-blue-100 transition"
        >
          <ArrowBackIosNewIcon />
        </button>
        <div className="m-4">
          <div className="flex justify-between mb-6">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">Title: {assignment.title}</h1>
              <p className="text-gray-700 p-1">
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
          <div className="">
            <CloudinaryUploadWidget
              cloud_name="dc2ztcjs0"
              upload_preset="r99tyjot"
              handleUpload={handleUpload}
            />
            <button
              onClick={() =>
                submissions.length > 0
                  ? handleEditsub(submissions[0]._id)
                  : handlesub()
              }
              className="mb-4 ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {submissions.length > 0 ? "Edit Submission" : "Submit Assignment"}
            </button>
          </div>

          {isDocVisible && assignmentDoc && (
            <div>
              <a
                href={assignmentDoc}
                className="text-blue-500 "
                target="_blank"
                rel="noopener noreferrer"
              >
                View Uploaded Document
              </a>
            </div>
          )}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Submissions</h2>
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <div
                  key={submission._id}
                  className="bg-white shadow-md rounded-lg p-4 mb-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p>
                        <strong>Submitted At:</strong>{" "}
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <a
                      href={submission.documentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View Submission
                    </a>
                    <Button
                      onClick={() => {
                        deletesub(submission._id);
                      }}
                    >
                      Delete submission
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No submissions yet.</p>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </Layout>
  );
};

export default AssignmentDetailsUser;
