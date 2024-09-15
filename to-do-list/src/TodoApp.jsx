// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = async () => {
    if (newTask) {
      const response = await axios.post('http://localhost:5000/api/tasks', { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    }
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.filter(task => task._id !== id));
  };

  const updateTask = async (id) => {
    const updatedTask = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
      title: editTaskTitle || editingTask.title,
      completed: editingTask.completed,
    });
    setTasks(tasks.map(task => (task._id === id ? updatedTask.data : task)));
    setEditingTask(null);
    setEditTaskTitle('');
  };

  const toggleCompletion = async (task) => {
    const updatedTask = await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      title: task.title,
      completed: !task.completed,
    });
    setTasks(tasks.map(t => (t._id === task._id ? updatedTask.data : t)));
  };

  return (
    <div>
      <h1>Todo List</h1>

      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            {editingTask && editingTask._id === task._id ? (
              <>
                <input
                  type="text"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                />
                <button onClick={() => updateTask(task._id)}>Save</button>
              </>
            ) : (
              <>
              <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompletion(task)}
                />
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </span>
                <div className="icons">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="edit-icon"
                    onClick={() => setEditingTask(task)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="delete-icon"
                    onClick={() => deleteTask(task._id)}
                  />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
