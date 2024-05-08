import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },
  dueDate: Date,
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const Task = mongoose.model('Task', taskSchema);
const User = mongoose.model('User', userSchema);

const createTask = async (taskData: object) => {
  const task = new Task(taskData);
  await task.save();
  return task;
};

const getTasks = async () => {
  return await Task.find();
};

const getTaskById = async (id: string) => {
  return await Task.findById(id);
};

const updateTask = async (id: string, updateData: object) => {
  return await Task.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteTask = async (id: string) => {
  await Task.findByIdAndDelete(id);
};

const createUser = async (userData: object) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const getUserByUsername = async (username: string) => {
  return await User.findOne({ username });
};

export { createTask, getTasks, getTaskById, updateTask, deleteTask, createUser, getUserByUsername };