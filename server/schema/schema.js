import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';

const connection = new Sequelize (
  'ride-my-way',
  'postgres',
  '',
  {
    dialect: 'postgres',
    host: 'localhost'
  }
);

const User = connection.define('user',{
  firstName:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userType:{
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate:{
      isEmail: true,
    }
  }
});
 const Ride = ('ride',{
   carType: {
     type: Sequelize.STRING,
     allowNull: false,
   },
   location: {
     type: Sequelize.STRING,
     allowNull: false,
   },
   destination: {
     type: Sequelize.STRING,
     allowNull: false,
   },
 });


// Ride.hasMany(User);
// User.hasOne(Ride);

  connection.sync({force: true})
  .then(()=>{
    _times(3, ()=> {
     return User.create({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      userType : 1,
      })
    })
  })
  .catch ((error)=>{
    console.log('error occured')
  })
  
export default connection;