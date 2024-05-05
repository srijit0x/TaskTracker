type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in progress' | 'done';
  createdAt: Date;
  updatedAt: Date;
};

const tasks: Task[] = [];

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const validateTask = (title: string, description?: string): boolean => {
  if (!title || title.length < 3) {
    throw new Error('Task title must be at least 3 characters long.');
  }
  if (description && description.length > 200) {
    throw new Error('Task description cannot exceed 200 characters.');
  }
  return true;
};

const createTask = (title: string, description?: string): Task => {
  validateTask(title, description);
  
  const newTask: Task = {
    id: generateId(),
    title,
    description,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.push(newTask);
  return newTask;
};

const updateTaskStatus = (taskId: string, newStatus: 'pending' | 'in progress' | 'done'): Task | undefined => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    throw new Error('Task not found.');
  }
  task.status = newStatus;
  task.updatedAt = new Date();
  return task;
};

const getTaskById = (taskId: string): Task | undefined => {
  return tasks.find(task => task.id === taskId);
};

const deleteTask = (taskId: string): void => {
  const index = tasks.findIndex(task => task.id === taskId);
  if (index === -1) {
    throw new Error('Task not found.');
  }
  tasks.splice(index, 1);
};

export { Task, createTask, updateTaskStatus, getTaskById, deleteTask };