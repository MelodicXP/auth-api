'use strict';

// THIS IS THE STRETCH GOAL ...
// It takes in a schema in the constructor and uses that instead of every collection
// being the same and requiring their own schema. That's not very DRY!

class DataCollection {

  constructor(model) {
    this.model = model;
  }

  async get(id) {
    if (id) {
      // Await until findOne is resolved
      return await this.model.findOne({ where: { id } });
    }
    else {
      // Await until find all is resolved
      return await this.model.findAll({});
    }
  }

  async create(record) {
    // Await until create is resolved
    return await this.model.create(record);
  }

  async update(id, data) {
    // First await until findone is resolved
    const record = await this.model.findOne({ where: { id } });
    // Then await update to resolve
    return await record.update(data);
  }

  async delete(id) {
    return await this.model.destroy({ where: { id }});
  }

}

module.exports = DataCollection;
