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
    }
    // async signIn(root, {email, password}, context) {

    // }
  }
};

export default resolvers;
