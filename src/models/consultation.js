module.exports = (sequelize, DataTypes) => {
  const Consultation = sequelize.define('Consultation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patientId: { type: DataTypes.INTEGER, allowNull: false },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
    scheduledFor: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('pending','confirmed','completed','cancelled'), defaultValue: 'pending' },
    notes: { type: DataTypes.TEXT },
  });
  return Consultation;
};
