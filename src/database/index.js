import Sequelize from 'sequelize';

import User from '../models/User';
import relational from '../configs/databases';

const models = [User];

class Database {
  constructor() {
    this.relationalDatabase();
  }

  relationalDatabase() {
    this.connection = new Sequelize(relational);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associete && model.associate(this.connection.models))
      .map(model => this.connection.sync(model));
  }
}

export default new Database();
