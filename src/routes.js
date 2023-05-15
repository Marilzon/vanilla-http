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
];
