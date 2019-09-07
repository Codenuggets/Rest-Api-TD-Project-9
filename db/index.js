const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
  transactionType: 'IMMEDIATE',
  retry: {
      match: [
        /SQLITE_BUSY/,
      ],
      name: 'query',
      max: 5
    },
  pool: {
      maxactive: 1,
      max: 5,
      min: 0,
      idle: 20000
    },
  logging: false
});

const db = {
  sequelize,
  Sequelize,
  models: {},
};

db.models.Course = require('./models/course.js')(sequelize);
db.models.User = require('./models/user.js')(sequelize);

// Creates associations
Object.keys(db.models).forEach((modelName) => {
  if (db.models[modelName].associate) {
    console.info(`Configuring the associations for the ${modelName} model...`);
    db.models[modelName].associate(db.models);
  }
});

module.exports = db;
