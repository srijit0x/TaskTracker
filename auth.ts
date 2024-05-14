class SimpleCache<T> {
  private cache: Record<string, T> = {};

  get(key: string): T | undefined {
    try {
      return this.cache[key];
    } catch (error) {
      console.error(`Failed to get value for key ${key} from cache. Error: ${error}`);
      return undefined;
    }
  }

  set(key: string, value: T): void {
    try {
      this.cache[key] = value;
    } catch (error) {
      console.error(`Failed to set value for key ${key} in cache. Error: ${error}`);
    }
  }
}

interface Task {
}

interface UserDetails {
}

const tasksCache = new SimpleCache<Task[]>();
async function getUserTasks(userId: string): Promise<Task[]> {
  try {
    let tasks = tasksCache.get(userId);
    if (!tasks) {
      tasks = await fetchTasksFromAPI(userId);
      tasksCache.set(userId, tasks);
    }
    return tasks;
  } catch (error) {
    console.error(`Failed to get user tasks for user ID ${userId}. Error: ${error}`);
    return [];
  }
}

async function fetchTasksFromAPI(userId: string): Promise<Task[]> {
  return [];
}

async function fetchUserDetails(userId: string): Promise<UserDetails> {
  return {} as UserDetails;
}

async function fetchMultipleUsersDetails(userIds: string[]): Promise<UserDetails[]> {
  try {
    const userDetailsPromises = userIds.map(id => fetchUserDetails(id));
    return Promise.all(userDetailsPromises);
  } catch (error) {
    console.error(`Failed to fetch multiple user details. Error: ${error}`);
    return [];
  }
}