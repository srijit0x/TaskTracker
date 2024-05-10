import { v4 as uuidv4 } from 'uuid';

type Task = {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in progress' | 'done';
    createdAt: Date;
    updatedAt: Date;
};

const taskList = new Map<string, Task>();

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
        id: uuidv4(),
        title,
        description,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    taskList.set(newTask.id, newTask);
    return newTask;
};

const changeTaskStatus = (taskId: string, newStatus: 'pending' | 'in progress' | 'done'): Task | undefined => {
    const task = taskList.get(taskId);
    if (!task) {
        throw new Error('Task not found.');
    }
    task.status = newStatus;
    task.updatedAt = new Date();
    return task;
};

const findTaskById = (taskId: string): Task | undefined => {
    return taskList.get(taskId);
};

const removeTask = (taskId: string): void => {
    if (!taskList.has(taskId)) {
        throw new Error('Task not found.');
    }
    taskList.delete(taskId);
};

export { 
    Task, 
    addNewTask as createTask, 
    changeTaskStatus as updateTaskStatus, 
    findTaskById as getTaskById, 
    removeTask as deleteTask 
};