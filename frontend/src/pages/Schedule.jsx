"use client";
import React, { useState, useEffect } from "react";
import {
  formatDate,
  // DateSelectArg,
  // EventInput,
  // EventClickArg,
  // EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import Auth from "../components/Auth";
import Layout from "../components/Layout";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useStore } from "../store";
import toast, { Toaster } from 'react-hot-toast';

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventTime, setNewEventTime] = useState(selectedEvent?._instance?.range?.end?.toISOString().slice(0, 16) || "");
  const [change,setchange] = useState(false);
  const { user,url } = useStore();

 console.log(selectedEvent?._instance?.range?.end)

  const fetchAllEvents = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`${url}/api/event/get-all-event?userId=${user?._id}`,config);
      const events = response.data.events;
      const fullCalendarEvents= events.map((event) => ({
        id: event._id,
        title: event.title,
        start: new Date(event.endDate).toISOString(),
        end: new Date(event.endDate).toISOString(),
        extendedProps: {
          user: event.User,
          assignmentId: event.assignmentId,
          taskId: event.taskId,
          challengeId: event.challengeId,
        },
      }));

      console.log(events)
      setCurrentEvents(fullCalendarEvents);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const updateEvent = async () => {
    try {
      if (!selectedEvent) return;
  
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const newEnd = newEventTime; // Ensure there's an end time
      
      // console.log(newEnd);
      const res=await axios.patch(`${url}/api/event/update-event`, {
        title: newEventTitle,
        userId: user?._id,
        DueDate: newEnd,
        eventId: selectedEvent.id,
      },config);
      console.log(res);
      selectedEvent.setProp("title", newEventTitle);
      selectedEvent.setDates(newEnd); // Update time on the calendar
      setchange(!change)
      fetchAllEvents();
      handleCloseDialog();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  

  const handleEventDrop = async (dropInfo) => {
    try {
        const { event } = dropInfo;
        
        // Get the new start and end times from dropInfo
        const newStart = event.start; 
        const newEnd = event.end || newStart; // Ensure there's an end time

        const DueDateISO = newEnd.toISOString(); // Convert to ISO format

        console.log("Dropped Event:", event.title, "New Start:", newStart, "New End:", newEnd);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const response = await axios.patch(
            `${url}/api/event/update-event`,
            {
                title: event.title,
                userId: user?._id,
                DueDate: DueDateISO, 
                eventId: event.id,
            },
            config
        );

        console.log(response);
        setchange(!change);

        // Optionally refetch events to sync
        fetchAllEvents();
    } catch (error) {
        toast.error(error.message);
    }
};

  useEffect(() => {
    fetchAllEvents();
  }, [user,change]);

  const handleDateClick = (selected) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected) => {
    setSelectedEvent(selected.event);
    setNewEventTime(selectedEvent?._instance?.range?.end)
    setNewEventTitle(selected.event.title || "");
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
    setNewEventTitle("");
    setNewEventTime("")
  };

  const handleDeleteEvent = async () => {
    try {
      if (!selectedEvent) return;
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      await axios.delete(`${url}/api/event/delete-event`,config, {
        params: {
          eventId: selectedEvent.id,
          userId: user?._id,
        },
      });
      selectedEvent.remove(); // Remove event from the calendar directly
      fetchAllEvents(); // Refresh events list
      handleCloseDialog();
      setchange(!change)
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      if (newEventTitle && selectedDate) {
        const calendarApi = selectedDate.view.calendar;
        calendarApi.unselect();
  
        const newEvent = {
          title: newEventTitle,
          userId:user?._id,
          DueDate: (new Date(selectedDate.end)).toISOString()
        };
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const newEventToBeAdded=await axios.post(`${url}/api/event/create-event`,config,newEvent);

        const event=newEventToBeAdded.data.event

        const fullCalendarEvents ={
          id: event._id,
          title: event.title,
          start: new Date(event.endDate).toISOString(),
          end: new Date(event.endDate).toISOString(),
          extendedProps: {
            user: event.User,
            assignmentId: event.assignmentId,
            taskId: event.taskId,
            challengeId: event.challengeId,
          }
        }
       
  
        calendarApi.addEvent(fullCalendarEvents); 
        console.log(fullCalendarEvents)
        handleCloseDialog();
        setchange(!change)
      }
    } catch (error) {
      toast.error(error);
      return;
    }
  };

  return (
    <Layout>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} padding="20px">
        {/* Sidebar for event list */}
        <Box width={{ xs: "100%", md: "30%" }} padding="20px">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Add Event, Stay Tuned Always :)
          </Typography>
          <Paper elevation={3} style={{ maxHeight: "70vh", overflow: "auto", padding: "10px" }}>
            <List>
              {currentEvents.length === 0 ? (
                <Typography variant="body2" color="textSecondary" align="center">
                  No Events Present
                </Typography>
              ) : (
                currentEvents.map((event) => (
                  <ListItem key={event.id} divider>
                    <ListItemText
                      primary={event.title}
                      primaryTypographyProps={{ fontWeight: "bold", fontSize: "1rem" }}
                      secondary={formatDate(event.end, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Box>

        {/* Calendar */}
        <Box width={{ xs: "100%", md: "70%" }} padding="20px">
          <FullCalendar
            height={"85vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop} 
            events={currentEvents}
          />
        </Box>

        {/* Add Event Dialog */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
          <DialogTitle align="center">Add New Event</DialogTitle>
          <DialogContent dividers>
            <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
              <TextField
                fullWidth
                variant="outlined"
                label="Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
                margin="normal"
              />
              <DialogActions className="flex justify-end space-x-4">
                <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Add
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog  */}

        <Dialog open={isEditDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
          <DialogTitle align="center">Edit Event</DialogTitle>
          <DialogContent dividers>
            <form onSubmit={(e) => { e.preventDefault(); updateEvent(); }} className="flex flex-col gap-4">
              <TextField
                fullWidth
                variant="outlined"
                label="Edit Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                variant="outlined"
                label=""
                type="datetime-local"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                margin="normal"
              />
              <DialogActions className="flex justify-between space-x-4">
                <Button onClick={handleDeleteEvent} color="error" variant="contained">
                  Delete
                </Button>
                <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>


      </Box>
    </Layout>
  );
};

export default Calendar;
