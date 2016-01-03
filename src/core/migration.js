'use strict';

require('dotenv').load();

const Umzug = require('umzug');

const db = require('./database');

// Instantiate Umzug
let options = {
  storage: 'sequelize',
  storageOptions: {
    sequelize: db.sequelize,
    modelName: 'MigrationSchema',
    tableName: 'MigrationTable' 
  },
  logging: false,   // TODO: Create new logger to migration function receive a message parameter.
  upName: 'up',
  downName: 'down',
  migrations: {
    params: [db],
    path: 'migrations',
    pattern: /(migrations.js)$/
  }
};

const umzug = new Umzug(options);

const type = process.argv[2];
run (type);

function run (type) {
  type = type === 'down' ? 'down' : 'up';

  return umzug[type]()
    .then((migrations) => {
      migrations.map((migration) => {
        console.log('Executed '+ type.toUpperCase() +': ', migration.file);
      });
    })
    .then(() => {
      console.log('Migration Success');
      process.exit();
    })
    .catch((err) => {
      console.log('Error executing migrations: ', err);
      process.exit(1);
    });
}

