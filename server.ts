import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const taskIndexCache: Record<number, number> = {};

app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (authHeader === `Bearer ${process.env.SECRET_TOKEN}`) {
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        next(error);
    }
});

let tasks: { id: number; content: string }[] = [];

const findTaskIndexCached = (taskId: number): number => {
    try {
        if (taskIndexCache[taskId] !== undefined && tasks[taskIndexCache[taskId]]?.id === taskId) {
            return taskIndexCache[taskId];
        } else {
            const index = tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                taskIndexCache[taskId] = index;
            }
            return index;
        }
    } catch (error) {
        console.error("Error finding task index:", error);
        throw error; // Rethrow error after logging it
    }
};

const cleanUpCache = () => {
    try {
        Object.keys(taskIndexCache).forEach(taskId => {
            const taskIndex = tasks.findIndex(t => t.id === Number(taskId));
            if (taskIndex === -1) {
                delete taskIndexCache[Number(taskId)];
            } else {
                taskIndexCache[Number(taskId)] = taskIndex;
            }
        });
    } catch (error) {
        console.error("Error cleaning up cache:", error);
        throw error; // Rethrow error after logging it
    }
};

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/tasks/:taskId', (req, res) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const taskIndex = findTaskIndexCached(taskId);
        
        if (taskIndex > -1) {
            res.json(tasks[taskIndex]);
        } else {
            res.status(404).send('Task not found');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/tasks', (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).send('Task content is required');
        }
        const newTask = { id: tasks.length + 1, content };
        tasks.push(newTask);
        res.status(201).send(newTask);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.put('/tasks/:taskId', (req, res) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const { content } = req.body;
        const taskIndex = findTaskIndexCached(taskId);
        
        if (taskIndex > -1) {
            tasks[taskIndex] = { id: taskId, content };
            cleanUpCache();
            res.send(tasks[taskIndex]);
        } else {
            res.status(404).send('Task not found');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.delete('/tasks/:taskId', (req, res) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const taskIndex = findTaskIndexCached(taskId);
        
        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            cleanUpCache();
            res.status(204).send();
        } else {
            res.status(404).send('Task not found');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Centralized error handling middleware
app.use((err: ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});