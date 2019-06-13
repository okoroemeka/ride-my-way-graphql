export default (sequelize, DataTypes) => {
  const ride = sequelize.define('ride', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    currentLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    carColor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    carType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  ride.associate = function(models) {
    // associations can be defined here
    ride.belongsTo(models.users, {
      foreignKey: 'userId'
    });
    ride.hasMany(models.request, {
      foreignKey: 'rideId',
      as: 'requests'
    });
  };
  return ride;
};
