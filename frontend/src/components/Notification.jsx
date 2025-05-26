import * as React from 'react';
import { useState } from 'react';
import Popover from '@mui/material/Popover';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useStore } from '../store';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import axios from 'axios';
import toast from 'react-hot-toast';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Notification() {
  const {user,setUser,url} = useStore()
  const [invitationStatus, setInvitationStatus] = useState({});
  
  const handleInvite = async(approval,mail)=>{
      try{
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.post(`${url}/api/team/invitation`,{approval,userId:user?._id,teamId:mail.teamId,mail},config)
        toast.success(data.message)
        setInvitationStatus((prevState) => ({
          ...prevState,
          [mail.teamId]: approval ? 'accepted' : 'rejected',
        }));
      }catch(e){
        toast.error(e.response.data.error)
      }
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleDelete = async(notificationId)=>{
    try{
      const {data} = await axios.delete(`${url}/api/notification`,{params:{userId:user._id,notificationId}})
      if(data.success){
        setUser(data.updatedUser)
      }
    }catch(error){
      toast.error(error.response.data.error)
    }
  }

  return (
    <div>
      <IconButton size="large" color="inherit" onClick={handleClick}>
              <Badge badgeContent={user?.inbox?.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {user?.inbox?.length>0 ? user.inbox.map(notif=>(
            <ListItem>
            <ListItemAvatar>
            <Avatar>
                <GroupsIcon />
            </Avatar>
            </ListItemAvatar>
            <ListItemText primary={notif.message} secondary={new Date(notif.date).toISOString().split('T')[0]}/>
            {notif.type == "group invite" && <div>
              {invitationStatus[notif.teamId] === 'accepted' ? (
                    <CheckCircleIcon color="success" />
                  ) : invitationStatus[notif.teamId] === 'rejected' ? (
                    <CancelOutlinedIcon color="error" />
                  ) : (
                    <>
                      <CheckCircleOutlineIcon
                        color="success"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleInvite(true, notif)}
                      />
                      <CancelOutlinedIcon
                        color="error"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleInvite(false, notif)}
                      />
                    </>
                  )}
            </div>}
            <DeleteIcon sx={{cursor:"pointer"}} onClick={()=>handleDelete(notif._id)}/>
          </ListItem>
        )):(
          <div>
            You have no notifications
          </div>
        )}
    </List>
      </Popover>
    </div>
  );
}
