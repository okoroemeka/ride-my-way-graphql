export default (sequelize, DataTypes) => {
  const request = sequelize.define(
    'request',
    {
      pickup_location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pickup_time: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  request.associate = models => {
    // associations can be defined here
    request.belongsTo(models.ride, {
      foreignKey: 'rideId',
      as: 'rideRequests',
      onDelete: 'CASCADE'
    });
  };
  request.associate = models => {
    // associations can be defined here
    request.belongsTo(models.users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return request;
};
