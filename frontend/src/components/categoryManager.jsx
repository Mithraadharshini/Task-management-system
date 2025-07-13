import React, { useState, useEffect } from 'react';
import {
  Typography, Box, TextField, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { categoriesAPI } from '../services/api';

export default function CategoryManager({onCategoriesChanged}) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    const res = await categoriesAPI.getCategories();
    setCategories(res.data.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    if (editingId) {
      await categoriesAPI.updateCategory(editingId, name);
    } else {
      await categoriesAPI.createCategory(name);
      setName('');
if (onCategoriesChanged) onCategoriesChanged(); // refresh category dropdown
    }
    setEditingId(null);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      await categoriesAPI.deleteCategory(id);
      fetchCategories();
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">Manage Categories</Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" onClick={handleSave}>
          {editingId ? 'Update' : 'Add'}
        </Button>
      </Box>

      <List sx={{ mt: 2 }}>
        {categories.map((cat) => (
          <ListItem key={cat.id}>
            <ListItemText primary={cat.name} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleEdit(cat)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(cat.id)} color="error">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
