const { GraphQLServer } = require("graphql-yoga");
const fs = require("fs");

// Database
const users = require("./users.json");

const updateDB = fs.writeFileSync(
  "./src/users.json",
  JSON.stringify(users),
  err => err && console.warn(err)
);

const resolvers = {
  Query: {
    users: () => users,
    usersById: (r, { id }, context, info) => users.find(u => u.id === id),
    usersByFavoriteFood: (r, { food }, context, info) =>
      users.filter(u => u.favoriteFood === food)
  },
  Mutation: {
    addUser: (r, args) => {
      users.push({
        id: args.id,
        firstName: args.firstName,
        lastName: args.lastName,
        favoriteFood: args.favoriteFood,
        favoriteRestaurant: args.favoriteRestaurant
      });

      updateDB();

      return users.find(i => i.id === args.id);
    }
  }
};

// 3
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.start(() => console.info(`Server is running on http://localhost:4000`));
