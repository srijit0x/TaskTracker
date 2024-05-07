type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in progress' | 'done';
  createdAt: Date;
  updatedAt: Date;
};

const taskList: Task[] = [];

const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const isTaskValid = (taskTitle: string, taskDescription?: string): boolean => {
  if (!taskTitle || taskTitle.length < 3) {
    throw new Error('Task title must be at least 3 characters long.');
  }
  if (taskDescription && taskDescription.length > 200) {
    throw new Error('Task description cannot exceed 200 characters.');
  }
  return true;
};

const addNewTask = (title: string, description?: string): Task => {
  isTaskValid(title, description);
  
  const newTask: Task = {
    id: generateUniqueId(),
    title,
    description,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  taskList.push(newTask);
  return newTask;
};

const changeTaskStatus = (taskId: string, newStatus: 'pending' | 'in progress' | 'done'): Task | undefined => {
  const task = taskList.find(t => t.id === taskId);
  if (!task) {
    throw new Error('Task not found.');
  }
  task.status = newStatus;
  task.updatedAt = new Date();
  return task;
};

const findTaskById = (taskId: string): Task | undefined => {
  return taskList.find(task => task.id === taskId);
};

const removeTask = (taskId: string): void => {
  const index = taskList.findIndex(task => task.id === taskId);
  if (index === -1) {
    throw new Error('Task not found.');
  }
  taskList.splice(index, 1);
};

export { Task, addNewTask as createTask, changeTaskStatus as updateTaskStatus, findTaskById as getTaskById, removeTask as deleteTask };