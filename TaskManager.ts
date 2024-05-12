import { v4 as generateUniqueId } from 'uuid';

interface ITask {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in progress' | 'done';
    createdAt: Date;
    updatedAt: Date;
}

const taskRegistry = new Map<string, ITask>();

const validateTaskDetails = (title: string, description?: string): boolean => {
    if (!title || title.length < 3) {
        throw new Error('Task title must be at least 3 characters long.');
    }
    if (description && description.length > 200) {
        throw new Error('Task description cannot exceed 200 characters.');
    }
    return true;
};

const createTask = (title: string, description?: string): ITask => {
    validateTaskDetails(title, description);

    const newTask: ITask = {
        id: generateUniqueId(),
        title,
        description,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    taskRegistry.set(newTask.id, newTask);
    return newTask;
};

const updateTaskStatus = (taskId: string, newStatus: 'pending' | 'in progress' | 'done'): ITask | undefined => {
    const taskToUpdate = taskRegistry.get(taskId);
    if (!taskToUpdate) {
        throw new Error('Task not found.');
    }
    taskToUpdate.status = newStatus;
    taskToUpdate.updatedAt = new Date();
    return taskToUpdate;
};

const getTaskById = (taskId: string): ITask | undefined => {
    return taskRegistry.get(taskId);
};

const deleteTask = (taskId: string): void => {
    if (!taskRegistry.has(taskId)) {
        throw new Error('Task not found.');
    }
    taskRegistry.delete(taskId);
};

export { 
    ITask, 
    createTask, 
    updateTaskStatus, 
    getTaskById, 
    deleteTask 
};