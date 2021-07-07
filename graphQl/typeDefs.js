const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    getUsers: [User]!, 
    getArtworks: [Artworks]!
  }
  
  type User {
      username: String!
      email: String!
  }

  type Pixel {
     index: Int!
         color: String!
    }
  type Artworks {
      author: String!
      name: String!
      linenumber: Int!
      pixelnumber: Int!
      pixels: String!
  }

`;