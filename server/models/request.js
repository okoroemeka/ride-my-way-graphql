export default (sequelize, DataTypes) => {
  const request = sequelize.define(
    'request',
    {
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      destinstion: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstname: {
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
