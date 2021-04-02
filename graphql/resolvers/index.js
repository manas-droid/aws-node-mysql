const queryResolvers = require('./query');
const mutationResolvers = require("./mutation")

module.exports = {
  Query : {
    ...queryResolvers.Query
  },
  Mutation : {
    ...mutationResolvers.Mutation
  }
};
