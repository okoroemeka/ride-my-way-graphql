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
  type ride {
    id: Int
    currentLocation: String!
    destination: String!
    capacity: Int!
    carColor: String!
    carType: String!
    plateNumber: String!
  }
  type Query {
    getUser(id: Int!): user
  }
  type Mutation {
    # user signup
    createUser(
      firstname: String!
      lastname: String!
      email: String!
      password: String!
      phone: Int!
      confirmPassword: String!
    ): user
    # user signin
    signIn(email: String!, password: String!): user
    #  Create ride
    createRide(
      currentLocation: String!
      destination: String!
      capacity: Int!
      carColor: String!
      carType: String!
      plateNumber: Int!
    ): ride
  }
`;

export default typeDefs;
