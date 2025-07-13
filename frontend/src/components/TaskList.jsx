"use client";
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Chip,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { Edit, Delete, CheckCircle, Schedule } from "@mui/icons-material";

export default function TaskList({ tasks, onToggleComplete, onEdit, onDelete }) {
  const renderPriorityBadge = (priority) => {
    if (!priority) return null;

    let color;
   switch (priority) {
  case "High":
    color = "#f44336"; // Red (MUI error main)
    break;
  case "Medium":
    color = "#ff9800"; // Orange (MUI warning main)
    break;
  case "Low":
    color = "#4caf50"; // Green (MUI success main)
    break;
  default:
    color = "#e0e0e0"; // Gray (fallback / default)
}
    

    return <Chip
  label={priority}
  size="small"
  sx={{
    backgroundColor: color,
    color: "#fff", // white text
  }}
/>;
  };

  if (tasks.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No tasks found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first task to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <List>
      {tasks.map((task) => {
        const isOverdue =
          task.due_date &&
          new Date(task.due_date) < new Date() &&
          !task.completed;

        return (
        <Paper
        key={task.id}
        sx={{
            mb: 1,
            border: isOverdue ? "2px solid red" : "1px solid #ddd",
            backgroundColor: isOverdue ? "#ff8fa3" : "inherit",
        }}
        >
            <ListItem>
              <Checkbox
                checked={task.completed}
                onChange={() => onToggleComplete(task)}
                sx={{ mr: 1 }}
                color="success"
              />
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        color: task.completed
                          ? "text.secondary"
                          : "text.primary",
                      }}
                    >
                      {task.title}
                    </Typography>

                    <Chip
                      icon={task.completed ? <CheckCircle /> : <Schedule />}
                      label={task.completed ? "Completed" : "Pending"}
                      size="small"
                      color={task.completed ? "success" : "warning"}
                      variant={task.completed ? "filled" : "outlined"}
                      sx={{
                        fontWeight: "bold",
                        "& .MuiChip-icon": {
                          fontSize: "16px",
                        },
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {task.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 1,
                          color: task.completed
                            ? "text.secondary"
                            : "text.primary",
                          fontStyle: task.completed ? "italic" : "normal",
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Category */}
                      <Chip
                        label={task.category_name}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />

                      {/* Due Date */}
                      {task.due_date && (
                        <Chip
                          label={`Due: ${new Date(
                            task.due_date
                          ).toLocaleDateString()}`}
                          size="small"
                          color={
                            new Date(task.due_date) < new Date() &&
                            !task.completed
                              ? "error"
                              : task.completed
                              ? "success"
                              : "default"
                          }
                          variant="outlined"
                        />
                      )}

                      {/* OVERDUE Chip */}
                      {isOverdue && (
                        <Chip
                          label="OVERDUE"
                          size="small"
                          color="error"
                          variant="filled"
                          sx={{
                            fontWeight: "bold",
                            animation: "pulse 2s infinite",
                          }}
                        />
                      )}

                      {/* Priority */}
                      {renderPriorityBadge(task.priority)}
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => onEdit(task)}
                  size="small"
                  color="primary"
                  title="Edit Task"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(task)}
                  size="small"
                  color="error"
                  title="Delete Task"
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        );
      })}
    </List>
  );
}
