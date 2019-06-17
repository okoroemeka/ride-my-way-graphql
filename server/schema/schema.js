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
    departure: String!
    capacity: Int!
    carColor: String!
    carType: String!
    plateNumber: String!
    userId: Int
  }
  type request {
    pickup_location: String!
    pickup_time: String!
    approved: Boolean!
    userId: Int!
    rideId: Int!
  }
  type Query {
    getSpecificRide(id: Int!): ride
    allRides: [ride]!
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
      departure: String!
      plateNumber: String!
    ): ride
    # ~Ride request
    rideRequest(
      pickup_location: String!
      pickup_time: String!
      rideId: Int!
    ): request
    # Respond to a ride request
    respondToRideRequest(
      rideId: Int!
      requestId: Int!
      approved: Boolean!
    ): request
  }
`;

export default typeDefs;
