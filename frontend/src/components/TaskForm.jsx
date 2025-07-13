import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,Alert, Snackbar
} from '@mui/material';
import { categoriesAPI } from '../services/api';

export default function TaskForm({ open, onClose, onSubmit, task, categories,setCategories }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
const [priority, setPriority] = useState('Medium'); // Default value
const [error, setError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleCategoryChange = async (e) => {
  const value = e.target.value;

  if (value === '__add_new__') {
    const newName = window.prompt('Enter new category name:');
    if (!newName) return;

    try {
      const res = await categoriesAPI.createCategory(newName);
      const newCategory = res.data.category;

      // Update categories in parent
      setCategories((prev) => [...prev, newCategory]);

      setCategoryId(newCategory.id);
    } catch (err) {
      alert('Failed to create category');
    }
  } else {
    setCategoryId(value);
  }
};

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.due_date || '');
      setCategoryId(task.category_id);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setCategoryId('');
    }
  }, [task, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
        setError('Title is required');
        setShowSnackbar(true);
        return;
        }

        if (!categoryId) {
        setError('Please select a category');
        setShowSnackbar(true);
        return;
        }

        setError('');
    onSubmit({
      title,
      description: description || undefined,
      due_date: dueDate || undefined,
      category_id: categoryId,
      completed: task?.completed || false,
      priority, // Include priority in the task data
    });

    onClose();
  };

  return (
    <>
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
            <FormControl fullWidth margin="normal">
  <InputLabel id="priority-label">Priority</InputLabel>
  <Select
    labelId="priority-label"
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
  >
    <MenuItem value="High">High</MenuItem>
    <MenuItem value="Medium">Medium</MenuItem>
    <MenuItem value="Low">Low</MenuItem>
  </Select>
</FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
            onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                    {category.name}
                </MenuItem>
                ))}
                <MenuItem value="__add_new__" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
                + Add new category
                </MenuItem>

            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {task ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
     {/* Snackbar for error */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setShowSnackbar(false)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}