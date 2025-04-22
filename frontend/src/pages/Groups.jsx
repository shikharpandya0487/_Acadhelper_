import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // React Router for navigation
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useStore } from '../store';
import toast, { Toaster } from 'react-hot-toast';
// import Auth from './Auth';
import Layout from '../components/Layout';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Groups = () => {
  const navigate = useNavigate();
  const { user, setUser ,url } = useStore();
  const [groups, setGroups] = useState([]);
  const [groupInput, setGroupInput] = useState({
    leader: user?._id,
    maxteamsize: 5,
    teamname: '',
    description: '',
    Members: [],
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupInput((prev) => ({ ...prev, [name]: value }));
  };

  // Fetching all groups of a user
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (!user?._id) {
          toast.error('User not logged in');
          return;
        }
        const { data } = await axios.get(`${url}/api/team?userId=${user._id}`,config);
        if (data.success) {
          setGroups(data.teams);
        }
        console.log(data);
      } catch (error) {
        console.log(data);
        toast.error(error.response.data.error);
      }
    };
    fetchGroups();
  }, [user]);

  console.log('Groups', groups);

  // Add group
  const handleAddGroup = async (e) => {
    e.preventDefault();
    try {
      if (!groupInput.teamname) {
        toast.error('Group name cannot be empty');
        return;
      }
      if (!groupInput.maxteamsize) {
        toast.error('Maximum group size cannot be empty');
        return;
      }
      if (isNaN(groupInput.maxteamsize) || groupInput.maxteamsize <= 0) {
        toast.error('Maximum group size must be a positive number');
        return;
      }
      if (!Number.isInteger(Number(groupInput.maxteamsize))) {
        toast.error('Maximum group size must be a positive integer');
        return;
      }

      const { data } = await axios.post(`${url}/api/team`, { team: groupInput, userId: user?._id },config);

      if (data.success) {
        setGroups(data.teams);
        setGroupInput({
          leader: user?._id,
          maxteamsize: 5,
          teamname: '',
          description: '',
          Members: [],
        });
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <Layout>
      <div className="font-bold text-2xl m-4">Groups</div>
      <div className="grid grid-cols-3">
        {groups.length > 0 ? (
          groups.map((group) => (
            <Link to={`/${group._id}/GroupPage`} key={group._id}>
              <Card sx={{ maxWidth: 345, margin: '2rem', height: '240px' }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGK3diR3Zi-mnOXEaj-3ewmFyRYVxGzVzZw&s"
                  title="green iguana"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {group.teamname}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {group.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="p-4">You don't have any groups yet</div>
        )}
      </div>

      {/* Add group icon */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>

      {/* Modal for Adding Groups */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Group
          </Typography>
          <div className="flex my-4">
            <TextField
              id="outlined-basic-name"
              label="Group Name"
              name="teamname"
              variant="outlined"
              sx={{ marginRight: '1rem' }}
              onChange={handleInputChange}
            />
            <TextField id="outlined-basic-name" label="Size limit" name="maxteamsize" variant="outlined" onChange={handleInputChange} />
          </div>
          <TextField
            id="outlined-basic-desc"
            label="Group Description"
            name="description"
            variant="outlined"
            multiline
            rows={4}
            sx={{ width: '100%' }}
            onChange={handleInputChange}
          />
          <div className="w-full mt-4 flex justify-end">
            <Button type="button" onClick={handleAddGroup}>
              Add
            </Button>
          </div>
        </Box>
      </Modal>

      <Toaster />
    </Layout>
  );
};

export default Groups;
