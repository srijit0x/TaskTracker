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

const TaskModel = mongoose.model('Task', taskSchema);
const UserModel = mongoose.model('User', userSchema);

const createNewTask = async (newTaskData: object) => {
  const newTask = new TaskModel(newTaskData);
  await newTask.save();
  return newTask;
};

const retrieveAllTasks = async () => {
  return await TaskModel.find();
};

const retrieveTaskById = async (taskId: string) => {
  return await TaskModel.findById(taskId);
};

const updateExistingTask = async (taskId: string, taskUpdateData: object) => {
  return await TaskModel.findByIdAndUpdate(taskId, taskUpdateData, { new: true });
};

const deleteExistingTask = async (taskId: string) => {
  await TaskModel.findByIdAndDelete(taskId);
};

const registerNewUser = async (newUserData: object) => {
  const newUser = new UserModel(newUserData);
  await newUser.save();
  return newUser;
};

const findUserByUsername = async (userName: string) => {
  return await UserModel.findOne({ username: userName });
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