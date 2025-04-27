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
import { Button, ButtonGroup } from '@mui/material';

// Function to get the week number from a date
const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + days) / 7);
};

// Generalized function to process completed task data by timeframe (week, month, day)
const processCompletedTaskData = (tasks = [], timeframe) => {
  const completedTaskCount = {};

  tasks.forEach((task) => {
    if (task.completed) {
      const createdDate = new Date(task.createdAt);
      let key;

      switch (timeframe) {
        case 'week':
          const weekNumber = getWeekNumber(createdDate);
          const year = createdDate.getFullYear();
          key = `${year}-W${weekNumber}`;
          break;
        case 'month':
          key = `${createdDate.getFullYear()}-${createdDate.getMonth() + 1}`; // "YYYY-MM"
          break;
        case 'day':
          key = createdDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
          break;
        default:
          key = '';
      }

      completedTaskCount[key] = (completedTaskCount[key] || 0) + 1;
    }
  });

  return Object.entries(completedTaskCount).map(([key, count]) => ({ weekKey: key, count }));
};

const CompletedTasksChart = ({ tasks = [] }) => {
  const [timeframe, setTimeframe] = useState('week');

  // Process data based on the selected timeframe
  const processedData = processCompletedTaskData(tasks, timeframe);

  // Find the max count for the YAxis
  const maxCount = processedData.length ? Math.max(...processedData.map((data) => data.count)) : 0;
  const axisPadding = 2;

  return (
    <div className='p-3'>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => setTimeframe('week')} color={timeframe === 'week' ? 'primary' : 'default'}>
          Per Week
        </Button>
        <Button onClick={() => setTimeframe('month')} color={timeframe === 'month' ? 'primary' : 'default'}>
          Per Month
        </Button>
        <Button onClick={() => setTimeframe('day')} color={timeframe === 'day' ? 'primary' : 'default'}>
          Per Day
        </Button>
      </ButtonGroup>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="weekKey" />
          <YAxis domain={[0, maxCount + axisPadding]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletedTasksChart;
