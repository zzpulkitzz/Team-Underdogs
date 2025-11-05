module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    consultationId: { type: DataTypes.INTEGER, allowNull: false },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    sentAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  return Chat;
};
