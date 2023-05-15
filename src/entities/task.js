const crypto = require("node:crypto");

class Task {
  constructor({ title, description }) {
    this.id = crypto.randomInt(1, 300);
    this.title = title;
    this.description = description;
    this.completed = false;
    this.created_at = new Date().toISOString().slice(0, 10);
    this.updated_at = null;
  }

  isValid() {
    const requiredProps = ["title", "description"];
    const missingProps = [];

    for (const [prop, value] of Object.entries(this)) {
      if (requiredProps.includes(prop) && !value) {
        missingProps.push(prop);
      }
    }

    return {
      valid: missingProps.length === 0,
      error: missingProps.map((prop) => `${prop} is missing!`),
    };
  }
}

module.exports = Task;
