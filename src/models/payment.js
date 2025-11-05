module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    consultationId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('pending','paid','failed'), defaultValue: 'pending' },
    transactionId: { type: DataTypes.STRING },
  });
  return Payment;
};
