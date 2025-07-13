import React, { useState, useEffect,useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Grid,
  Paper,
  Alert,  Dialog,
  DialogTitle,
  DialogContent,IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

import { Add, Logout } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI, categoriesAPI } from '../services/api';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import dayjs from 'dayjs'; // install via `npm install dayjs`
import CategoryManager from './categoryManager';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import {ColorModeContext} from '../App';
import CalendarView from './calendarView.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');
const [showCategories, setShowCategories] = useState(false);
const [priorityFilter, setPriorityFilter] = useState('all');

const theme = useTheme();
const colorMode = useContext(ColorModeContext);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, categoryFilter,priorityFilter]);

  const fetchTasks = async () => {
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await tasksAPI.getTasks(params);
      setTasks(response.data.tasks);
    } catch (error) {
      setError('Failed to fetch tasks');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      setError('Failed to fetch categories');
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((task) =>
        statusFilter === 'completed' ? task.completed : !task.completed
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((task) => task.category_name === categoryFilter);
    }
    if (priorityFilter !== 'all') {
        filtered = filtered.filter((task) => task.priority === priorityFilter);
    }
    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      fetchTasks();
      setError('');
    } catch (error) {
      setError('Failed to create task');
    }
  };
const handleReorder = (newOrder) => {
  setTasks(newOrder); // or optionally send to DB to persist order
};

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;

    try {
      await tasksAPI.updateTask(editingTask.id, taskData);
      fetchTasks();
      setEditingTask(null);
      setError('');
    } catch (error) {
      setError('Failed to update task');
    }
  };

  const handleToggleComplete = async (task) => {
  try {
    await tasksAPI.updateTask(task.id, {
      ...task,
      due_date: task.due_date
        ? dayjs(task.due_date).format('YYYY-MM-DD') // ✅ format the date
        : null,
      completed: !task.completed,
    });
    fetchTasks();
    setError('');
  } catch (error) {
    setError('Failed to update task');
  }
};

  const handleDeleteTask = async (task) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await tasksAPI.deleteTask(task.id);
      fetchTasks();
      setError('');
    } catch (error) {
      setError('Failed to delete task');
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Task Manager - Welcome, {user?.name}!
          </Typography>
           {/* 🌙 Toggle Theme Button */}
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
  {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
</IconButton>
          <Button color="inherit" onClick={logout} startIcon={<Logout />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Search tasks"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{ minWidth: 200 }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="all">All</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        label="Priority"
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </Select>
                    </FormControl>

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setTaskFormOpen(true)}
                  sx={{ ml: 'auto' }}
                >
                  Add Task
                </Button>
            <Button variant="contained" onClick={() => setShowCategories(true)} >
            Manage Categories
            </Button>

            <Dialog open={showCategories} onClose={() => setShowCategories(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
            Category Management
            <IconButton
                aria-label="close"
                onClick={() => setShowCategories(false)}
                sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
                }}
            >
    <CloseIcon />
  </IconButton>
</DialogTitle>
  <DialogContent>
    <CategoryManager onCategoriesChanged={fetchCategories} />
  </DialogContent>
</Dialog>

              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onEdit={(task) => {
                setEditingTask(task);
                setTaskFormOpen(true);
              }}
              onDelete={handleDeleteTask}
              
            />
            <Grid item xs={12}>
  <CalendarView tasks={filteredTasks} />
</Grid>

          </Grid>
        </Grid>

        <TaskForm
          open={taskFormOpen}
          onClose={() => {
            setTaskFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          task={editingTask}
           categories={categories}
        setCategories={setCategories}
        />
      </Container>
    </>
  );
}