import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoApp.css";

// BACKEND API URL - Change this if your backend runs on different port
const API_URL = "http://localhost:5000/api/todos";
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Load todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // GET all todos from backend
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      alert(
        "❌ Failed to fetch todos. Make sure backend is running on port 5000!",
      );
    } finally {
      setLoading(false);
    }
  };

  // POST - Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        title: title.trim(),
        description: description.trim(),
      });
      setTodos([response.data, ...todos]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("❌ Failed to add todo");
    }
  };

  // DELETE - Remove todo
  const deleteTodo = async (id) => {
    if (!window.confirm("Delete this todo?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("❌ Failed to delete todo");
    }
  };

  // PUT - Toggle completion status
  const toggleComplete = async (todo) => {
    try {
      const response = await axios.put(`${API_URL}/${todo._id}`, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === todo._id ? response.data : t)));
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("❌ Failed to update todo");
    }
  };

  // Start editing
  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  // PUT - Save edited todo
  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
      setEditingId(null);
    } catch (error) {
      console.error("Error saving edit:", error);
      alert("❌ Failed to save changes");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  // Statistics
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="todo-container">
      <h1>📝 Todo App</h1>

      {/* Connection Status */}
      <div className="connection-status">
        {loading
          ? "⏳ Loading..."
          : `✅ Connected to Backend (${todos.length} todos)`}
      </div>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="todo-input title-input"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="todo-input desc-input"
          />
        </div>
        <button type="submit" className="add-btn">
          ➕ Add Todo
        </button>
      </form>

      {/* Stats */}
      <div className="todo-stats">
        <span>📊 Total: {total}</span>
        <span>✅ Completed: {completed}</span>
        <span>⏳ Pending: {pending}</span>
      </div>

      {/* Todo List */}
      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>🎉 No todos yet!</p>
            <p className="sub-text">Add one above to get started</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo._id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              {editingId === todo._id ? (
                // Edit Mode
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="edit-input"
                    placeholder="Description"
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => saveEdit(todo._id)}
                      className="save-btn"
                    >
                      💾 Save
                    </button>
                    <button onClick={cancelEdit} className="cancel-btn">
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo)}
                      className="todo-checkbox"
                    />
                    <div className="todo-text">
                      <span className="todo-title">{todo.title}</span>
                      {todo.description && (
                        <span className="todo-description">
                          {todo.description}
                        </span>
                      )}
                      <span className="todo-date">
                        📅 {new Date(todo.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="todo-actions">
                    <button
                      onClick={() => startEditing(todo)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TodoApp;
