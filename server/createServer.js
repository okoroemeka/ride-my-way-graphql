import { GraphQLServer } from 'graphql-yoga';
import models from './models/index';
import typeDefs from './schema/schema';
import resolvers from './resolvers/resolvers';

const createServer = () => {
  return new GraphQLServer({
    typeDefs,
    resolvers,
    resolveValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({ ...req, models })
  });
};

export default createServer;
