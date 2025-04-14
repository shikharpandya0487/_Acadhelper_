import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { Button, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useStore } from "../../store";
// import Auth from '../../components/Auth'
import { useNavigate, useParams } from "react-router-dom";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const Settings = () => {
  const router = useNavigate();
  const {groupId} = useParams();
  console.log(groupId)
  const { user, setUser, url } = useStore();
  const [input, setInput] = useState("");
  const [team, setTeam] = useState(null);
  const [groupInput, setGroupInput] = useState({
    maxteamsize: 0,
    teamname: "",
    description: "",
  });
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // For edit group
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setGroupInput((prev) => ({ ...prev, [name]: value }));
  };

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [openLeave, setOpenLeave] = useState(false);
  const handleOpenLeave = () => setOpenLeave(true);
  const handleCloseLeave = () => setOpenLeave(false);
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  // Fetching group details
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${url}/api/team/info/${groupId}`, {
          params: { type: "Team" },
          ...config
        });
        setTeam(res?.data?.team);
        console.log(res.data);
        setGroupInput({
          maxteamsize: res?.data?.team.maxteamsize,
          teamname: res?.data?.team.teamname,
          description: res?.data?.team.description,
        });
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.error);
      }
    };
    fetchTeam();
  }, []);

  //  Fetching group members
  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const { data } = await axios.get(`${url}/api/team/info/${groupId}`,{
          params: { type: "Members" },
          ...config
        });
        if (data.success) {
          setMembers(data.members);
          toast.success("Loaded members");
        }

        console.log(data);
      } catch (e) {
        console.log(e.response);
        toast.error(e.response.data.error);
      }
    };
    fetchGroupMembers();
  }, []);

  //Leave a group
  const handleLeave = async () => {
    try {
      const res = await axios.delete(`${url}/api/team/leave/${groupId}`, {
        params: { userId: user?._id, groupId:groupId },
        ...config
      });
      if (res.data.success) {
        router("/Groups");
        toast.success("Group left successfully");
      }
    } catch (e) {
      toast.error(e.response.data.error);
    }
  };

  //Delete a group(by group admin)
  const handleDelete = async () => {
    try {
      if (user?._id != team?.leader.toString()) {
        toast.error("You are not authorised to delete this group");
        return;
      }
      const res = await axios.delete(`${url}/api/team/delete/${team?._id}`,config);
      if (res.data.success) {
        toast.success("Group deleted successfully");
        router("/Groups");
      }
    } catch (e) {
      toast.error(e.response.data.error);
    }
  };

  //Edit group details
  const handleEditGroup = async () => {
    try {
      if (!groupInput.teamname) {
        toast.error("Group name cannot be empty");
        return;
      }
      if (!groupInput.maxteamsize) {
        toast.error("Maximum group size cannot be empty");
        return;
      }

      if (
        isNaN(groupInput.maxteamsize) ||
        groupInput.maxteamsize < 0 ||
        groupInput.maxteamsize > 10
      ) {
        console.log(groupInput.maxteamsize)
        toast.error(
          "Maximum group size must be a positive integer and should be less than or equal to 10"
        );
        return;
      }

      if (!Number.isInteger(Number(groupInput.maxteamsize))) {
        toast.error("Maximum group size must be a positive integer <=10");
        return;
      }

      if (groupInput) {
        const res = await axios.put(`${url}/api/team/edit-team/${team?._id}`,{
          team: groupInput,
        },config);
        if (res.data.success) {
          toast.success("Group edited successfully");
          handleCloseEdit();
        }
      }
    } catch (e) {
      toast.error(e.response.data.error);
    }
  };

  // Add member to group
  const handleAddMember = async () => {
    try {
      if (input) {
        const res = await axios.post(`${url}/api/team/add-member/${groupId}`, {
          email: input,
        },config);
        if (res.data.success) {
          toast.success("Invitation sent");
          handleClose();
        }
      } else {
        toast.error("Field cannot be empty");
        return;
      }
    } catch (e) {
      toast.error(e.response.data.error);
    }
  };

  return (
    <>
      <div className="flex justify-evenly">
        <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          <nav aria-label="main mailbox folders">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Members
            </Typography>

            <List>
              {members.map((member) => (
                <ListItem key={member._id} disablePadding id={member._id}>
                  <ListItemButton>
                    <ListItemIcon>
                      <Avatar
                        alt={member.username}
                        src="/static/images/avatar/2.jpg"
                      />
                    </ListItemIcon>
                    <ListItemText primary={member?.username} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </nav>
        </Box>
        {team?.leader.toString() == user?._id ? (
          <div className="flex flex-col w-40 ">
            <Button variant="outlined" onClick={handleOpen}>
              Add member
            </Button>
            <Button
              variant="outlined"
              onClick={handleOpenEdit}
              sx={{ marginY: "10px" }}
            >
              Edit Group
            </Button>
            <Button variant="outlined" onClick={handleOpenDelete} color="error">
              Delete Group
            </Button>
          </div>
        ) : (
          <Button
            variant="outlined"
            onClick={handleOpenLeave}
            color="error"
            sx={{ height: "3rem" }}
          >
            Leave Group
          </Button>
        )}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Member
          </Typography>
          <TextField
            id="outlined-basic-name"
            label="Email"
            variant="outlined"
            sx={{ marginTop: "2rem", width: "100%" }}
            onChange={handleInputChange}
          />
          <div className="w-full mt-4 flex justify-end">
            <Button onClick={handleAddMember} variant="outlined">
              Invite
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Group
          </Typography>
          <div className="flex my-4">
            <TextField
              id="outlined-basic-name"
              name="teamname"
              defaultValue={team?.teamname}
              label="Group Name"
              variant="outlined"
              sx={{ marginRight: "1rem" }}
              onChange={handleEditInputChange}
            />
            <TextField
              id="outlined-basic-name"
              name="maxteamsize"
              defaultValue={team?.maxteamsize}
              label="Size limit"
              variant="outlined"
              onChange={handleEditInputChange}
            />
          </div>
          <TextField
            id="outlined-basic-desc"
            name="description"
            defaultValue={team?.description}
            label="Group Description"
            variant="outlined"
            multiline
            rows={4}
            sx={{ width: "100%" }}
            onChange={handleEditInputChange}
          />
          <div
            className="w-full mt-4 flex justify-end"
            onClick={handleEditGroup}
          >
            <Button>Edit</Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to delete this group?
          </Typography>
          <div className="w-full mt-4 flex justify-end">
            <Button onClick={handleDelete} variant="outlined">
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openLeave}
        onClose={handleCloseLeave}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to leave this group ?
          </Typography>
          <div className="w-full mt-4 flex justify-end">
            <Button onClick={handleLeave} variant="outlined">
              Leave
            </Button>
          </div>
        </Box>
      </Modal>
      <Toaster />
    </>
  );
};

export default Settings;
