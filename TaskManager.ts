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

function logError(error: Error): void {
    console.error(error.message);
}

const validateTaskDetails = (title: string, description?: string): boolean => {
    try {
        if (!title || title.length < 3) {
            throw new Error('Task title must be at least 3 characters long.');
        }
        if (description && description.length > 200) {
            throw new Error('Task description cannot exceed 200 characters.');
        }
        return true;
    } catch (error) {
        logError(error as Error);
        throw error;
    }
};

const createTask = (title: string, description?: string): ITask => {
    try {
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
    } catch (error) {
        logError(error as Error);
        throw new Error('Failed to create a new task.');
    }
};

const updateTaskStatus = (taskId: string, newStatus: 'pending' | 'in progress' | 'done'): ITask | undefined => {
    try {
        const taskToUpdate = taskRegistry.get(taskId);
        if (!taskToUpdate) {
            throw new Error('Task not found.');
        }
        taskToUpdate.status = newStatus;
        taskToUpdate.updatedAt = new Date();
        return taskToUpdate;
    } catch (error) {
        logError(error as Error);
        throw new Error('Failed to update task status.');
    }
};

const getTaskById = (taskId: string): ITask | undefined => {
    return taskRegistry.get(taskId);
};

const deleteTask = (taskId: string): void => {
    try {
        if (!taskRegistry.has(taskId)) {
            throw new Error('Task not found.');
        }
        taskRegistry.delete(taskId);
    } catch (error) {
        logError(error as Error);
        throw new Error('Failed to delete task.');
    }
};

export { 
    ITask, 
    createTask, 
    updateTaskStatus, 
    getTaskById, 
    deleteTask 
};