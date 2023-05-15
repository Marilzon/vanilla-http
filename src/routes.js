import { Database } from "./database.js";
import { buidRoutePath } from "./utils/build-route-path.js";
import { randomInt } from "node:crypto";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buidRoutePath("/task"),
    handler: (request, response) => {
      const { title, description } = request.body;
      let missingProps = [];

      if (!title) missingProps.push("title");
      if (!description) missingProps.push("description");

      if (missingProps.length) {
        const missingPropsMessage = `The following props are missing: ${missingProps.join(
          ","
        )}`;
        return response.status(400).send(missingPropsMessage);
      }

      const task = {
        id: randomInt(1, 9999),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString().slice(0, 10),
      };

      database.insert("tasks", task);

      return response.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buidRoutePath("/tasks"),
    handler: (request, response) => {
      const { search } = request.query;

      const tasks = database.select("tasks", {
        title: search,
        description: search,
      });

      return response.end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buidRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;
      let missingProps = [];

      if (!title) missingProps.push("title");
      if (!description) missingProps.push("description");

      if (missingProps.length) {
        const missingPropsMessage = `The following props are missing: ${missingProps.join(
          ","
        )}`;
        return response.status(400).send(missingPropsMessage);
      }

      const [task] = database.select("tasks", id, {
        title,
        description,
        updated_at: new Date().toISOString().slice(0, 10),
      });

      return response.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buidRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      const [task] = database.select("tasks", { id });

      if (!task) return response.writeHead(404).end;

      database.delete("tasks", id);

      return response.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buidRoutePath("/tasks:id/complete"),
    handler: (request, response) => {
      const { id } = request.params;
      const [task] = database.select("tasks", { id });

      if (!task) return response.writeHead(404).end();

      const taskCompleted = !!task.completed_at;
      const completed_at = taskCompleted
        ? null
        : new Date().toISOString().slice(0, 10);

      database.update("tasks", id, { completed_at });

      return response.writeHead(204).end();
    },
  },
];
