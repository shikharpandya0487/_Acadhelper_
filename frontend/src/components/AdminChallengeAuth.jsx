import { useStore } from "../store";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const AdminChallengeAuth = (Component) => {
  return (props) => {
    const { user, url } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const challengeId = searchParams.get("id");

    const [courseId, setCourseId] = useState(null);

    useEffect(() => {
      const fetchChallenge = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const res = await axios.get(`${url}/api/challenge/getchallengeById?Id=${challengeId}`,config);
          setCourseId(res.data.courseId);
        } catch (error) {
          console.error("Error fetching challenge:", error);
        }
      };

      if (challengeId) fetchChallenge();
    }, [challengeId]);

    useEffect(() => {
      if (courseId && user) {
        const hasAccess = user.CoursesAsAdmin.some(
          (adminCourseId) => adminCourseId.toString() === courseId
        );
        if (!hasAccess) {
          navigate("/unauthorized", { replace: true });
        }
      }
    }, [user, courseId]);

    return user && user.CoursesAsAdmin.includes(courseId) ? (
      <Component {...props} />
    ) : null;
  };
};
