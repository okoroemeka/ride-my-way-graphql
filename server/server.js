import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import createServer from './createServer';

dotenv.config({ path: 'variables.env' });

const server = createServer();
// const port = 4200;

// TODO use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Sever is now running on port https://localhost:${deets.port}`);
  }
);
// const app = express();

// const port = 4200;

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: req => ({ ...req, models })
// });
// using cookie parser
// server.express.use(cookieParser());
// //checking for token
// server.express.use((req, res, next) => {
//   const { token } = req.cookies;
//   // console.log('💥💥💥💥', token);
//   if (token) {
//     const { userId } = jwt.verify(token, process.env.APP_SECRET);
//     // console.log('User --->>>> 💥💥💥💥', token);
//     req.userId = userId;
//   }
//   next();
// });
// server.applyMiddleware({ app });

// app.listen({ port }, () =>
//   console.log(
//     `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
//   )
// );
