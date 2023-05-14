class TaskService {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async find(itemId) {
    return this.taskRepository.find(itemId);
  }

  async create(data) {
    return this.taskRepository.create(data);
  }
}

module.exports = TaskService;
