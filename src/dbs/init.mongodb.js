const mongoose = require('mongoose');
const {
  db: { host, port, name },
} = require('../configs/config.mongodb');
const mongoString = `mongodb://${host}:${port}/${name}`;
const { countConnect } = require('../helpers/check.connect');

// Dung Strategy Pattern de connect mysql, mongodb
class Database {
  constructor() {
    this.connect();
  }

  //connet
  connect(type = 'mongodb') {
    // develop environment
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(mongoString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log(`MongoDB Connected Success!`, mongoString))
      .catch((err) => console.log('Error Connect!', err));
  }

  // Khoi tao instance dung static
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
