const { GraphQLServer } = require("graphql-yoga");
const fs = require("fs");

const users = require("./users.json");

const resolvers = {
  Query: {
    users: () => users,
    usersById: (r, { id }, context, info) => users.filter(u => u.id === id),
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

      fs.writeFileSync(
        "./src/users.json",
        JSON.stringify(users),
        err => err && console.log(err)
      );

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
