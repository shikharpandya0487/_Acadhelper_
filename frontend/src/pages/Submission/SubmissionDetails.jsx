import { useEffect, useState } from "react";
import axios from "axios";
// import Auth from '../../components/AdminAuth'
import toast from "react-hot-toast";
import {  useParams } from "react-router-dom";
import { useStore } from "../../store";

const SubmissionDetails = () => {
    // const router = useNavigate();
    const { id } = useParams();
    const [submission, setSubmission] = useState(null);
    const [user, setUser] = useState(null);
    const {url} =useStore();

    // async function fetchUser(userId) {
    //     try {
    //         const response = await axios.get(`/api/user?Id=${userId}`);
    //         if (response.data.success) {
    //             return response.data.data;
    //         } else {
    //             return null;
    //         }
    //     } catch (error) {
    //         toast.error(error.response.data.error)
    //         return null;
    //     }
    // }
    useEffect(() => {
        if (id) {
            const fetchSubmission = async () => {
                try {
                    const Us=useStore().user;
                    const config = {
                        headers: {
                          Authorization: `Bearer ${Us.token}`,
                        },
                      };
                    const response = await axios.get(`${url}/api/submission?Id=${id}`,config);
                    const fetchedSubmission = response.data.data;
                    setSubmission(fetchedSubmission);
                    if (fetchedSubmission.User) {
                        try {
                            const response = await axios.get(`${url}/api/user?Id=${fetchedSubmission.User}`,config);
                            if (response.data.success) {
                                setUser(response.data.data);
                            } else {
                                toast.error(response.data);
                            }
                        }
                        catch (err) {
                            toast.error(err.response.data.error)
                        }
                    }
                } catch (error) {
                    toast.error(error.response.data.error)
                }
            };
            fetchSubmission();
        }
    }, [id]);

    if (!submission) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
                <h1 className="text-3xl font-bold mb-4">Submission Details</h1>
                <p><strong>Submitted By:</strong> {user?.username}</p>
                <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                <p><strong>Verified:</strong> {submission.isVerified ? "Yes" : "No"}</p>
                <p><strong>Marks Obtained:</strong> {submission.marksObtained ?? "N/A"}</p>
                <p><strong>Feedback:</strong> {submission.feedback ?? "N/A"}</p>
                <a href={submission.documentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    View Document
                </a>
            </div>
        </div>
    );
};

export default SubmissionDetails;
