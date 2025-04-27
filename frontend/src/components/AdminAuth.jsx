import { useStore } from "../store";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const AdminAuth = (Component) => {
  return (props) => {
    const { user,url } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const courseId = searchParams.get("id");

    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const checkAuthorization = async () => {
        if (!user || !courseId) return;

        try {
          // Optional: Fetch course details if needed
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const res = await axios.get(`${url}/api/course/${courseId}`,config);
          const validCourseId = res.data.courseId;

          const hasAccess = user.CoursesAsAdmin.some(
            (adminCourseId) => adminCourseId.toString() === validCourseId
          );

          setIsAuthorized(hasAccess);
          if (!hasAccess) navigate("/unauthorized", { replace: true });
        } catch (error) {
          console.error("Error checking authorization:", error);
          navigate("/unauthorized", { replace: true });
        }
      };

      checkAuthorization();
    }, [user, courseId]);

    return isAuthorized ? <Component {...props} /> : null;
  };
};
