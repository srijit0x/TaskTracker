import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${process.env.SECRET_TOKEN}`) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
});

let tasks: { id: number; content: string }[] = [];

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/tasks/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

app.post('/tasks', (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).send('Task content is required');
    }
    const newTask = { id: tasks.length + 1, content };
    tasks.push(newTask);
    res.status(201).send(newTask);
});

app.put('/tasks/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const { content } = req.body;
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex > -1) {
        tasks[taskIndex] = { id: taskId, content };
        res.send(tasks[taskIndex]);
    } else {
        res.status(404).send('Task not found');
    }
});

app.delete('/tasks/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Task not found');
    }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});