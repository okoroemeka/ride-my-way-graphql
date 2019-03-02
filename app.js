import express from 'express';
import graphqlHTTP from 'express-graphql';
import cors from 'cors';
// import schema from './Schema/schema';

const app = express();

app.use(cors());

// app.use('/graphql', graphqlHTTP({
//   schema,
//   graphiql: true,
// }));
const port = 7000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
