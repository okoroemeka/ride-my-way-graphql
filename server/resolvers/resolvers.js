import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const resolvers = {
  Query: {
    async getUser(parent, { id }, context) {
      return context.models.users.findById(id);
    }
  },
  Mutation: {
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
    async signIn(root, args, context) {
      const data = Object.keys(args);
      let emptyFields = [];
      data.forEach(element => {
        if (!args[element].length) {
          emptyFields.push(element);
        }
      });
      if (emptyFields.length) {
        throw new Error(
          `The ${emptyFields.join()} field${
            emptyFields.length > 1 ? 's' : ''
          } ${emptyFields.length > 1 ? 'are' : 'is'} empty`
        );
      }
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
    }
  }
};

export default resolvers;
