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

const TaskModel = mongoose.model('Task', taskSchema);
const UserModel = mongoose.model('User', userSchema);

const createNewTask = async (newTaskData: object) => {
  try {
    const newTask = new TaskModel(newTaskData);
    await newTask.save();
    return newTask;
  } catch (error) {
    console.log(`Error creating a new task: ${error.message}`);
    throw error; // Rethrow to allow further handling by the caller
  }
};

const retrieveAllTasks = async () => {
  try {
    return await TaskModel.find();
  } catch (error) {
    console.log(`Error retrieving tasks: ${error.message}`);
    throw error;
  }
};

const retrieveTaskById = async (taskId: string) => {
  try {
    return await TaskModel.findById(taskId);
  } catch (error) {
    console.log(`Error finding task by ID: ${error.message}`);
    throw error;
  }
};

const updateExistingTask = async (taskId: string, taskUpdateData: object) => {
  try {
    return await TaskModel.findByIdAndUpdate(taskId, taskUpdateData, { new: true });
  } catch (error) {
    console.log(`Error updating task: ${error.message}`);
    throw error;
  }
};

const deleteExistingTask = async (taskId: string) => {
  try {
    await TaskModel.findByIdAndDelete(taskId);
  } catch (error) {
    console.log(`Error deleting task: ${error.message}`);
    throw error;
  }
};

const registerNewUser = async (newUserData: object) => {
  try {
    const newUser = new UserModel(newUserData);
    await newUser.save();
    return newUser;
  } catch (error) {
    console.log(`Error registering user: ${error.message}`);
    throw error;
  }
};

const findUserByUsername = async (userName: string) => {
  try {
    return await UserModel.findOne({ username: userName });
  } catch (error) {
    console.log(`Error finding user by username: ${error.message}`);
    throw error;
  }
};

export { 
  createNewTask, 
  retrieveAllTasks, 
  retrieveTaskById, 
  updateExistingTask, 
  deleteExistingTask, 
  registerNewUser, 
  findUserByUsername 
};