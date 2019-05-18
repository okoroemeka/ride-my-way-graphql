module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rides', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      currentLocation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: false
      },
      carName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      carColor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      carType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      plateNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'userId'
        }
      }
    });
  },
  down: queryInterface => queryInterface.dropTable('rides')
};
