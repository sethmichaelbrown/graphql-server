const { GraphQLServer } = require("graphql-yoga");

const users = require("./users.json");
// 1
const typeDefs = `
type Query {
  users: [User!]!,
  usersById(id: Int!): [User!]!
  usersByFavoriteFood(food: String): [User!]!
}


type User {
	id: Int!,
	firstName: String!,
	lastName: String!,
	favoriteFood: String,
	favoriteRestaurant: String
}
`;

// 2
const resolvers = {
  Query: {
    users: () => users,
    usersById: (r, { id }, context, info) => users.filter(u => u.id === id),
    usersByFavoriteFood: (r, { food }, context, info) =>
      users.filter(u => u.favoriteFood === food)
  }
};

// 3
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.info(`Server is running on http://localhost:4000`));
