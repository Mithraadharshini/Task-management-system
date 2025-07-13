// src/components/CalendarView.jsx
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Paper, Typography } from '@mui/material';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarView({ tasks }) {
  const events = tasks
    .filter((task) => task.due_date)
    .map((task) => ({
      title: task.title,
      start: new Date(task.due_date),
      end: new Date(task.due_date),
      allDay: true,
    }));

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        📅 Calendar View of Tasks
      </Typography>
      <Box sx={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />
      </Box>
    </Paper>
  );
}
