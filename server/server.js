import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import createServer from './createServer';

dotenv.config({ path: 'variables.env' });

const server = createServer();

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
