// to handler data with database
const { readFile, writeFile } = require("node:fs/promises");

class TaskRepository {
  constructor({ file }) {
    this.file = file;
  }

  async _currentFileContent() {
    return JSON.parse(await readFile(this.file));
  }

  async find(itemId) {
    const all = await this._currentFileContent();

    if (!itemId) return all;
    return all.find(({ id }) => itemId === id);
  }
}

module.exports = TaskRepository;

const task = new TaskRepository({
  file: "../../database/data.json",
});

task
  .find()
  .then(console.log)
  .catch((error) => console.log("error", error));
