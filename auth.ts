import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

interface UserPayload {
    id: number;
    email: string;
}

const runAsync = (callback: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        callback(req, res, next).catch(next);
    };
};

app.post('/register', runAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    res.status(201).json({ message: 'User created', userId: user.id });
}));

app.post('/login', runAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload: UserPayload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
}));

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, SECRET_KEY) as UserPayload;
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

app.get('/tasks', authenticate, runAsync(async (req: Request, res: Response) => {
    const tasks = await prisma.task.findMany({
        where: {
            userId: req.user!.id,
        },
    });
    res.json(tasks);
}));

app.use((req, res, next) => {
    res.status(404).json({ error: "Not found" });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));