import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type user {
    id: Int
    firstname: String!
    lastname: String!
    email: String!
    password: String!
    confirmPassword: String!
    phone: Int!
  }
  type Query {
    getUser(id: Int!): user
  }
  type Mutation {
    createUser(
      firstname: String!
      lastname: String!
      email: String!
      password: String!
      phone: Int!
      confirmPassword: String!
    ): user
    # signIn()
  }
`;

export default typeDefs;
