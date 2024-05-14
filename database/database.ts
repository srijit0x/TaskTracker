import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(`Database connection error: ${err.message}`));

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

const addTask = async (taskDetails: object) => {
  try {
    const task = new Task(taskDetails);
    await task.save();
    return task;
  } catch (error) {
    console.log(`Error adding a new task: ${error.message}`);
    throw error; // Rethrow to allow further handling by the caller
  }
};

const getAllTasks = async () => {
  try {
    return await Task.find();
  } catch (error) {
    console.log(`Error retrieving tasks: ${error.message}`);
    throw error;
  }
};

const getTaskById = async (taskId: string) => {
  try {
    return await Task.findById(taskId);
  } catch (error) {
    console.log(`Error finding task by ID: ${error.message}`);
    throw error;
  }
};

const updateTask = async (taskId: string, updatedTaskDetails: object) => {
  try {
    return await Task.findByIdAndUpdate(taskId, updatedTaskDetails, { new: true });
  } catch (error) {
    console.log(`Error updating task: ${error.message}`);
    throw error;
  }
};

const removeTask = async (taskId: string) => {
  try {
    await Task.findByIdAndDelete(taskId);
  } catch (error) {
    console.log(`Error removing task: ${error.message}`);
    throw error;
  }
};

const createUser = async (userDetails: object) => {
  try {
    const user = new User(userDetails);
    await user.save();
    return user;
  } catch (error) {
    console.log(`Error creating user: ${error.message}`);
    throw error;
  }
};

const getUserByUsername = async (username: string) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    console.log(`Error finding user by username: ${error.message}`);
    throw error;
  }
};

export { 
  addTask, 
  getAllTasks, 
  getTaskById, 
  updateTask, 
  removeTask, 
  createUser, 
  getUserByUsername 
};