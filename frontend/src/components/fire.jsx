import * as React from "react";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useStore } from "../store";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import { LinearProgress } from "@mui/material";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
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

export default function Fire() {
  const { user, url } = useStore();
  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const fetchDaily = async () => {
      try {

        const { data } = await axios.post(
          `${url}/api/challenge/get-challengeByFreq`,
          { frequency: "daily", userId: user._id },config
        );
        console.log(data);
        if (data.success) {
          setDaily(data.data);
        }
      } catch (e) {
        toast.error("Error while fetching challenge");
      }
    };
    const fetchWeekly = async () => {
      try {
        const { data } = await axios.post(
          `${url}/api/challenge/get-challengeByFreq`,
          { frequency: "weekly", userId: user._id },config
        );

        console.log(data);
        if (data.success) {
          setWeekly(data.data);
        }
      } catch (e) {
        toast.error("Error while fetching the challenge");
      }
    };
    fetchDaily();
    fetchWeekly();
    setLoading(true);
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading === false) {
    return <LinearProgress color="primary" />;
  }
  return (
    <div>
      <IconButton size="large" color="inherit" onClick={handleClick}>
        <LocalFireDepartmentIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              centered
              sx={{
                "& .MuiTabs-flexContainer": {
                  justifyContent: "center",
                },
                minHeight: 0,
              }}
            >
              <Tab label="Daily challenge" {...a11yProps(0)} />
              <Tab label="Weekly challenge" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="overflow-y-auto max-h-60">
              {daily.length > 0 ? (
                daily.map((challenge, idx) => (
                  <Link
                    key={`${idx}+${challenge?._id}`}
                    to={`/Challenge/${challenge?._id}`}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <EmojiEventsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={challenge.title}
                        secondary={
                          new Date(challenge.endDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      />
                      <Chip label={`${challenge.points} points`} />
                    </ListItem>
                  </Link>
                ))
              ) : (
                <div>
                  There are no daily challenges in your enrolled courses yet
                </div>
              )}
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div className="overflow-y-auto max-h-60">
              {weekly.length > 0 ? (
                weekly.map((challenge, idx) => (
                  <Link
                    key={`${idx * 3}+${challenge?._id}`}
                    to={`/Challenge/${challenge._id}`}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <EmojiEventsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={challenge.title}
                        secondary={
                          new Date(challenge.endDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      />
                      <Chip label={`${challenge.points} points`} />
                    </ListItem>
                  </Link>
                ))
              ) : (
                <div>
                  There are no weekly challenges in your enrolled courses yet
                </div>
              )}
            </div>
          </CustomTabPanel>
        </Box>
      </Popover>
    </div>
  );
}
