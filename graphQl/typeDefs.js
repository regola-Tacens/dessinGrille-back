const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    getUsers: [User]!, 
    getArtworks: [Artworks]!
    login(username: String!, password: String!): User !
  }

  type Mutation {
    register(username: String! email: String! password: String! confirmPassword: String!): User!
    saveArtwork(author:String! name: String! linenumber: Int! pixelnumber: Int! pixels: String!): Artworks!
    deleteArtwork(name:String!):Artworks
  }
  
  type User {
      username: String!
      email: String!
      createdAt: String!
      
      password: String!
      token: String
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



