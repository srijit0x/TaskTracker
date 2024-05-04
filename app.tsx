import React, { useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addNewTask = (text: string) => {
    try {
      if (!text) throw new Error("Task cannot be empty.");
      const newTask = { id: Date.now(), text, completed: false };
      setTasks(previousTasks => [...previousTasks, newTask]);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      }
    }
  };

  const removeTaskById = (taskId: number) => {
    try {
      setTasks(tasks => tasks.filter(task => task.id !== taskId));
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      }
    }
  };

  const toggleCompletionStatus = (taskId: number) => {
    try {
      setTasks(tasks => 
        tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      }
    }
  };

  const updateTaskText = (taskId: number, newText: string) => {
    try {
      if (!newText) throw new Error("Task cannot be empty.");
      setTasks(tasks => 
        tasks.map(task => 
          task.id === taskId ? { ...task, text: newText } : task
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      }
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <TaskForm onAddTask={addNewTask} />
      <TaskDisplay
        tasks={tasks}
        onToggleCompletion={toggleCompletionStatus}
        onDeleteTask={removeTaskById}
        onEditTask={updateTaskText}
      />
    </div>
  );
};

interface TaskFormProps {
  onAddTask: (text: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [taskInput, setTaskInput] = useState('');

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddTask(taskInput.trim());
    setTaskInput('');
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

interface TaskDisplayProps {
  tasks: Task[];
  onToggleCompletion: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, newText: string) => void;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({
  tasks,
  onToggleCompletion,
  onDeleteTask,
  onEditTask,
}) => {
  return (
    <ul>
      {tasks.map(task => (
        <TaskListItem
          key={task.id}
          task={task}
          onToggleTaskCompletion={onToggleCompletion}
          onDeleteTask={onDeleteTask}
          onEditTaskText={onEditTask}
        />
      ))}
    </ul>
  );
};

interface TaskListItemProps {
  task: Task;
  onToggleTaskCompletion: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTaskText: (taskId: number, newText: string) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onToggleTaskCompletion,
  onDeleteTask,
  onEditTaskText,
}) => {
  const [isEditActive, setIsEditActive] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const activateEdit = () => {
    setIsEditActive(true);
  };

  const handleEditTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const cancelEdit = () => {
    setIsEditActive(false);
    setEditText(task.text);
  };

  const saveEditedText = () => {
    onEditTaskText(task.id, editText.trim());
    setIsEditActive(false);
  };

  return (
    <li>
      {isEditActive ? (
        <>
          <input type="text" value={editText} onChange={handleEditTextChange} />
          <button onClick={saveEditedText}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <span 
            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            onClick={() => onToggleTaskCompletion(task.id)}
          >
            {task.text}
          </span>
          <button onClick={() => onDeleteTask(task.id)}>Delete</button>
          <button onClick={activateEdit}>Edit</button>
        </>
      )}
    </li>
  );
};

export default App;