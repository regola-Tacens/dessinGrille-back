const { User } = require('../models')

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
      getArtworks: () => {
          const artworks=[
              {
                  name: 'pixel mushroom',
                  linenumber: 4,
                  pixelnumber:2,
                  pixels: [
                      {
                          index :0, 
                          color : 'white'
                      },
                      {
                          index :1, 
                          color : 'red'
                      },
                      {
                          index :2, 
                          color : 'white'
                      },
                      {
                          index :3, 
                          color : 'white'
                      },
                  ]
              }
          ]
          return artworks
      }
    },
  
  };