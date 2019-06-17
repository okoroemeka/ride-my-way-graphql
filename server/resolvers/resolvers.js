import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import checkFieldsfrom from '../utils/checkFields';
import userAuth from '../utils/userAuth';
import {
  findRideRequestById,
  findRideById,
  rideTableOptions
} from '../utils/queryHelper';

const resolvers = {
  Query: {
    /**
     * @ Gets all ride offer
     * @param {object} parent
     * @param {object} args
     * @param {object} context
     * @param {object} info
     * @returns {array} allRides
     */
    async allRides(parent, args, context, info) {
      const { models } = context;
      const allRides = await models.ride.findAll({
        where: {},
        attributes: [
          'id',
          'currentLocation',
          'destination',
          'departure',
          'capacity',
          'carColor',
          'carType',
          'plateNumber',
          'userId'
        ]
      });
      return allRides;
    },
    /**
     * @ Gets a specific ride offer
     * @param {object} parent
     * @param {object} args
     * @param {object} context
     * @param {object} info
     * @returns {object} ride
     */
    async getSpecificRide(parent, args, context, info) {
      const {
        models,
        request: { userId }
      } = context;
      const { id } = args;
      if (!userId) throw new Error('Please login to continue');

      const ride = await models.ride.findOne({
        where: { id },
        attributes: [
          'id',
          'currentLocation',
          'destination',
          'departure',
          'capacity',
          'carColor',
          'carType',
          'plateNumber',
          'userId'
        ]
      });
      if (!ride) throw new Error('This ride has been removed');

      return ride;
    }
  },
  Mutation: {
    /**
     * @ Creates a user
     * @returns {object} user
     * @param {object} root
     * @param {object} param1
     * @param {object} context
     */
    async createUser(
      root,
      { firstname, lastname, email, phone, password, confirmPassword },
      context,
      info
    ) {
      const { models } = context;
      const checkUser = await models.users.findOne({
        where: {
          email
        }
      });
      if (checkUser)
        throw new Error('User already exist, please signin to continue.');

      if (password !== confirmPassword)
        throw new Error('Password do match, check them to confirm');

      // Hash password
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await models.users.create({
        firstname,
        lastname,
        email,
        phone,
        password: hashPassword
      });
      // Create token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.APP_SECRET
      );
      //Add token to ccokie
      context.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365
      });
      return user;
    },

    /**
     * @ Log in User
     * @returns {object} user
     * @param {object} root
     * @param {object} param1
     * @param {object} context
     */
    async signIn(root, args, context, info) {
      checkFieldsfrom(args);
      const { email, password } = args;
      const { models } = context;
      const user = await models.users.findOne({
        where: {
          email
        }
      });
      if (!user) throw new Error('The user does not exist, please signup');

      const { dataValues } = user;
      const valid = await bcrypt.compare(password, dataValues.password);
      if (!valid) throw new Error('Wrong email or password');

      const token = jwt.sign(
        { userId: dataValues.id, email: dataValues.email },
        process.env.APP_SECRET
      );

      context.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365
      });
      return dataValues;
    },
    /**
     * @ Create a ride Offer
     * @param {object} root
     * @param {object} args
     * @param {object} context
     * @param {object} info
     * @returns {object} ride
     */
    async createRide(root, args, context, info) {
      checkFieldsfrom(args);
      const { userId } = context.request;
      if (!userId) throw new Error('Please login to continue');

      const { models } = context;
      const ride = await models.ride.create({
        ...args,
        userId
      });
      return ride;
    },
    /**
     * @ Make a ride request
     * @param {object} root
     * @param {object} args
     * @param {object} context
     * @param {object} info
     * @returns {object} rideRequest
     */
    async rideRequest(root, args, context, info) {
      userAuth(context);
      checkFieldsfrom(args);
      const { userId } = context.request;
      const { models } = context;
      const { rideId } = args;

      const ride = await findRideById(models, rideId, rideTableOptions);
      if (!ride) throw new Error('This ride offer no longer exists');
      const rideRequest = await models.request.create({
        ...args,
        userId
      });
      return rideRequest;
    },
    /**
     * @ Respond to ride request
     * @param {object} root
     * @param {object} args
     * @param {object} context
     * @param {object} info
     * @returns {object} request
     */
    async respondToRideRequest(root, args, context, info) {
      userAuth(context);
      const { models } = context;
      const { rideId, requestId, approved } = args;
      const ride = await findRideById(models, rideId, rideTableOptions);
      if (!ride) throw new Error('This ride offer no longer exists');
      if (ride.dataValues.capacity < 1)
        throw new Error('This ride is full already');
      const { approved: checkStatus } = findRideRequestById(models, requestId);
      if (checkStatus !== approved) {
        await models.request.update(
          { approved },
          { where: { id: requestId, rideId } }
        );
        if (approved === true) {
          await models.ride.update(
            { capacity: ride.dataValues.capacity - 1 },
            {
              where: {
                id: rideId
              }
            }
          );
        }
      }
      const updatedRequest = await findRideRequestById(models, requestId);
      return updatedRequest;
    },
    /**
     * @ Delete ride offer
     * @param {object} root
     * @param {object} args
     * @param {object} context
     * @param {object} info
     * @return {object} message
     */
    async deleteRideOffer(root, args, context, info) {
      const {
        models,
        request: { userId }
      } = context;
      const { rideId } = args;
      const checkRideOffer = await findRideById(
        models,
        rideId,
        rideTableOptions
      );
      if (!checkRideOffer) throw new Error('The ride offer does not exist');
      const {
        dataValues: { userId: dbUserId }
      } = checkRideOffer;
      if (dbUserId !== userId)
        throw new Error("You don't have permission to delete this ride offer");
      await models.ride.destroy({
        where: {
          id: rideId
        }
      });
      return { text: 'Ride offer deleted successfully' };
    }
  }
};

export default resolvers;
