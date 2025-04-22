import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaderboardComponent from "../components/Leaderboard";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { institutes } from "./SampleData/Sample";
import toast, { Toaster } from "react-hot-toast";
// import Auth from "../components/Auth";
import Layout from "../components/Layout"; 
import { useStore } from "../store";



const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [institute, setInstitute] = useState("");
  const {user,url}=useStore();

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${url}/api/user/getAllUsers`,config);
      console.log(data);
      if (data?.success) {
        const usersWithPoints = data.users.map((user) => {
          const totalPoints = user.Totalpoints.reduce((sum, course) => sum + course.points, 0);
          return {
            ...user,
            totalPoints,
          };
        });

        // Sort users by totalPoints in descending order
        usersWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);
        setUsers(usersWithPoints);
      }
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilter = async () => {
    
    console.log("Filter applied:", institute);
    try {
        if (!institute) {
            toast.error("Please enter an institute name");
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            params: {
                filter: institute,
            },
        };

        const { data } = await axios.get(`${url}/api/user/filter`, config);

        if (data?.success) {
            const usersWithPoints = data.users.map((user) => {
                const totalPoints = Array.isArray(user.Totalpoints)
                    ? user.Totalpoints.reduce((sum, course) => sum + (course.points || 0), 0)
                    : 0;

                return { ...user, totalPoints };
            });

            // Sort users by totalPoints in descending order
            usersWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);

            setUsers(usersWithPoints);
        }

        
    } catch (e) {
        console.error("Filter Error:", e);
        toast.error(e.response?.data?.message || e.message || "Error filtering users");
    }
};


  const clearFilter = () => {
    setInstitute("");
    fetchUsers();
  };

  return (
    <div>
      <Layout>
        <div className="m-4 w-full text-center text-3xl font-bold p-2">Global Leaderboard</div>
        <div className="flex justify-center">
          <InputLabel id="demo-simple-select-label">Institute</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={institute}
            label="Institute"
            onChange={(e) => setInstitute(e.target.value)}
            sx={{ width: "40%", marginX: "20px" }}
          >
            {institutes.map((uni) => (
              <MenuItem key={uni} value={uni}>
                {uni}
              </MenuItem>
            ))}
          </Select>
          <Button variant="outlined" onClick={handleFilter}>
            Filter
          </Button>
          <Button variant="outlined" onClick={clearFilter} sx={{ marginLeft: "10px" }}>
            Clear Filter
          </Button>
        </div>

        <LeaderboardComponent users={users} />
        <Toaster />
      </Layout>
    </div>
  );
};

export default Leaderboard;
