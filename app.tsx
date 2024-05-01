import React, { useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (text: string) => {
    const newTask = { id: Date.now(), text, completed: false };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const editTask = (id: number, newText: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, text: newText } : task)));
  };

  return (
    <div>
      <AddTaskForm addTask={addTask} />
      <TaskList
        tasks={tasks}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    </div>
  );
};

interface AddTaskFormProps {
  addTask: (text: string) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ addTask }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTask(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

interface TaskListProps {
  tasks: Task[];
  toggleTaskCompletion: (id: number) => void;
  deleteTask: (id: number) => void;
  editTask: (id: number, newText: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTaskCompletion, deleteTask, editTask }) => {
  return (
    <ul>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTaskCompletion={toggleTaskCompletion}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      ))}
    </ul>
  );
};

interface TaskItemProps {
  task: Task;
  toggleTaskCompletion: (id: number) => void;
  deleteTask: (id: number) => void;
  editTask: (id: number, newText: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, toggleTaskCompletion, deleteTask, editTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewText(e.target.value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewText(task.text);
  };

  const handleSave = () => {
    editTask(task.id, newText);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <>
          <input type="text" value={newText} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <span 
            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            onClick={() => toggleTaskCompletion(task.id)}
          >
            {task.text}
          </span>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
          <button onClick={handleEdit}>Edit</button>
        </>
      )}
    </li>
  );
};

export default App;