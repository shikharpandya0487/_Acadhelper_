import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Button, ButtonGroup, Box, Typography } from '@mui/material';

// Function to process incomplete tasks based on timeframe
const processIncompletedTaskData = (tasks, timeframe) => {
  const IncompletedTaskCount = {};

  tasks.forEach(task => {
    if (!task.completed) {
      const createdDate = new Date(task.createdAt);
      let timeKey;

      switch (timeframe) {
        case 'month':
          timeKey = `${createdDate.getFullYear()}-${(createdDate.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
        case 'day':
          timeKey = createdDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
          break;
        default: // 'week'
          const weekNumber = Math.ceil(((createdDate - new Date(createdDate.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000) + createdDate.getDay() + 1) / 7);
          timeKey = `${createdDate.getFullYear()}-W${weekNumber}`;
      }

      IncompletedTaskCount[timeKey] = (IncompletedTaskCount[timeKey] || 0) + 1;
    }
  });

  const processedData = Object.entries(IncompletedTaskCount).map(([timeKey, count]) => ({ timeKey, count }));

  // Ensure at least one entry exists to show X and Y axis
  return processedData.length > 0 ? processedData : [{ timeKey: 'No Data', count: 0 }];
};

const IncompletedTaskChart = ({ tasks = [] }) => {
  const [timeframe, setTimeframe] = useState('week');

  const processedData = processIncompletedTaskData(tasks, timeframe);
  const maxCount = Math.max(...processedData.map(data => data.count), 0); // Prevent -Infinity
  const axisPadding = maxCount > 0 ? 2 : 1; // Ensure Y-axis visibility

  return (
    <Box sx={{ textAlign: 'center' }}>
      <ButtonGroup variant="contained" aria-label="timeframe selection" sx={{ mb: 3 }}>
        <Button onClick={() => setTimeframe('week')} color={timeframe === 'week' ? 'primary' : 'inherit'}>
          Per Week
        </Button>
        <Button onClick={() => setTimeframe('month')} color={timeframe === 'month' ? 'primary' : 'inherit'}>
          Per Month
        </Button>
        <Button onClick={() => setTimeframe('day')} color={timeframe === 'day' ? 'primary' : 'inherit'}>
          Per Day
        </Button>
      </ButtonGroup>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeKey" />
          <YAxis domain={[0, maxCount + axisPadding]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#e74c3c" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IncompletedTaskChart;
