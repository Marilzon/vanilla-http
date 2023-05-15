const http = require("node:http");
const PORT = 3333;
const HOTSNAME = "127.0.0.1";
const DEFAULT_HEADER = { "Content-Type": "application/json" };
const { generateInstance } = require("./factories/taskFactory");
const taskService = generateInstance();
const Task = require("./entities/task");

const routes = {
  "/tasks:get": async (request, response) => {
    const { id } = request.queryString;
    const tasks = await taskService.find(id);
    response.write(JSON.stringify({ results: tasks }));

    return response.end();
  },

  "/tasks:post": async (request, response) => {
    for await (const data of request) {
      const item = JSON.parse(data);
      const task = new Task(item);
      const { error, valid } = task.isValid();

      if (!valid) {
        response.writeHead(400, "Bad request!", DEFAULT_HEADER);
        response.write(JSON.stringify({ error: error.join(",") }));
        return response.end();
      }

      const id = await taskService.create(task);
      response.writeHead(201, DEFAULT_HEADER);
      response.write(JSON.stringify({ success: "Task created with success!" }));
      return response.end();
    }
  },

  default: (request, response) => {
    response.writeHead(404, "404, route not found", DEFAULT_HEADER);
    response.end();
  },
};

const handler = (request, response) => {
  const { url, method } = request;
  const [_, route, id] = url.split("/");
  request.queryString = { id: isNaN(id) ? id : Number(id) };

  const key = `/${route}:${method.toLowerCase()}`;
  response.writeHead(200, DEFAULT_HEADER);

  const chosen = routes[key] || routes.default;
  return chosen(request, response);
};

http.createServer(handler).listen(PORT, HOTSNAME, () => {
  console.log(`server up at ${HOTSNAME}:${PORT}`);
});
