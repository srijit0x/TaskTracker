// A simple in-memory cache implementation
class SimpleCache<T> {
  private cache: Record<string, T> = {};

  get(key: string): T | undefined {
    return this.cache[key];
  }

  set(key: string, value: T): void {
    this.cache[key] = value;
  }
}

// Usage with an asynchronous function to get user tasks
const tasksCache = new SimpleCache<Task[]>();
async function getUserTasks(userId: string): Promise<Task[]> {
  let tasks = tasksCache.get(userId);
  if (!tasks) {
    tasks = await fetchTasksFromAPI(userId);
    tasksCache.set(userId, tasks);
  }
  return tasks;
}

async function fetchMultipleUsersDetails(userIds: string[]): Promise<UserDetails[]> {
  const userDetailsPromises = userIds.map(id => fetchUserDetails(id));
  return Promise.all(userDetailsPromises);
}