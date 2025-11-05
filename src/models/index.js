const { Sequelize } = require('sequelize');
const config = require('../config').development;
const { DATABASE_URL } = process.env;
require('dotenv').config();
const sequelize = new Sequelize(DATABASE_URL, {
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
db.Consultation = require('./consultation')(sequelize, Sequelize);
db.Chat = require('./chat')(sequelize, Sequelize);
db.Payment = require('./payment')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Consultation, { foreignKey: 'patientId', as: 'PatientConsultations' });
db.User.hasMany(db.Consultation, { foreignKey: 'doctorId', as: 'DoctorConsultations' });
db.Consultation.belongsTo(db.User, { foreignKey: 'patientId', as: 'Patient' });
db.Consultation.belongsTo(db.User, { foreignKey: 'doctorId', as: 'Doctor' });

db.Consultation.hasMany(db.Chat, { foreignKey: 'consultationId' });
db.Chat.belongsTo(db.Consultation, { foreignKey: 'consultationId' });

db.Consultation.hasOne(db.Payment, { foreignKey: 'consultationId' });
db.Payment.belongsTo(db.Consultation, { foreignKey: 'consultationId' });


module.exports = db;
