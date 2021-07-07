const { User } = require('../models');
const {Artworks} = require('../models');

module.exports = {
    Query: {
      getUsers: async () => {    
        try {
            const users = await User.findAll()
            return users
        } catch (error) {
            console.log(error)
        }
      },
      getArtworks: async() => {
          try {
              const artworked = await Artworks.findAll()
               return artworked
          } catch (error){
             console.log(error)
          }
          
      }
    },
  
  };