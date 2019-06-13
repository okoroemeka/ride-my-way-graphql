import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import checkFieldsfrom from '../utils/checkFields';

const resolvers = {
  Query: {
    async getUser(parent, { id }, context) {
      return context.models.users.findById(id);
    }
  },
  Mutation: {
    /**
     * @returns {object} user
     * @param {object} root
     * @param {object} param1
     * @param {object} context
     */
    async createUser(
      root,
      { firstname, lastname, email, phone, password, confirmPassword },
      context
    ) {
      const checkUser = await context.models.users.findOne({
        where: {
          email
        }
      });
      if (checkUser) {
        throw new Error('User already exist, please signin to continue.');
      }
      if (password !== confirmPassword) {
        throw new Error('Password do match, check them to confirm');
      }
      // Hash password
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await context.models.users.create({
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
     * @returns {object} user
     * @param {object} root
     * @param {object} param1
     * @param {object} context
     */
    async signIn(root, args, context) {
      checkFieldsfrom(args);
      const { email, password } = args;
      const user = await context.models.users.findOne({
        where: {
          email
        }
      });
      if (!user) {
        throw new Error('The user does not exist, please signup');
      }
      const { dataValues } = user;
      const valid = await bcrypt.compare(password, dataValues.password);
      if (!valid) {
        console.log(valid);
        throw new Error('Wrong email or password');
      }

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
    async createRide(root, args, context) {
      checkFieldsfrom(args);
      const { userId } = context.request;
      if (!userId) {
        throw new Error('Please login to continue');
      }
      const ride = await context.models.ride.create({
        ...args,
        userId
      });
      return ride;
    }
  }
};

export default resolvers;
