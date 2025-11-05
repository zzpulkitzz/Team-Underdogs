const { Sequelize } = require('sequelize');
const config = require('../config').development;

const sequelize = new Sequelize("postgresql://postgres.cfcskwbthvaucoqvasog:cHRBzk4isT0kcOQN@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres", {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Supabase requires SSL
    },
  },
  logging: false, // optional, turns off SQL logs
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);

module.exports = db;
