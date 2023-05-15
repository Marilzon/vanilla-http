const TaskRepository = require("./../repositories/taskRepository");
const TaskService = require("./../services/taskService");

const { resolve } = require("node:path");
const filename = resolve("database", "data.json");

function generateInstance() {
  const taskRepository = new TaskRepository({
    file: filename,
  });

  const taskService = new TaskService({
    taskRepository,
  });

  return taskService;
}

module.exports = { generateInstance };
