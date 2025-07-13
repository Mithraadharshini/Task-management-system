import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = `
      SELECT t.*, c.name as category_name 
      FROM tasks t 
      JOIN categories c ON t.category_id = c.id 
      WHERE t.user_id = $1
    `;
    const params = [req.user.id];
    let paramCount = 1;

    if (status === 'completed') {
      query += ` AND t.completed = true`;
    } else if (status === 'pending') {
      query += ` AND t.completed = false`;
    }

    if (category) {
      paramCount++;
      query += ` AND c.name = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND t.title ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY t.created_at DESC`;

    const result = await pool.query(query, params);
    res.json({ tasks: result.rows });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, due_date, category_id,completed = false, priority = 'Medium' } = req.body;

    if (!title || !category_id) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description, due_date, category_id,completed,priority,user_id) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *',
      [title, description || null, due_date || null, category_id,completed,priority,req.user.id]
    );

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Update task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, due_date, category_id, completed, priority } = req.body;
    const taskId = req.params.id;

    const result = await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, due_date = $3, category_id = $4, completed = $5, priority = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8 
       RETURNING *`,
      [title, description || null, due_date || null, category_id, completed, priority, taskId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;