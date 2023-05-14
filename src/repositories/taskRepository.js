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

  async create(data) {
    const currentFile = await this._currentFileContent();
    currentFile.push(data);
    const { id } = data;

    await writeFile(this.file, JSON.stringify(currentFile));

    return id;
  }
}

module.exports = TaskRepository;

const task = new TaskRepository({
  file: "../../database/data.json",
});

task
  .create({ id: 3, title: "New task" })
  .then(console.log)
  .catch((error) => console.log("error", error));
