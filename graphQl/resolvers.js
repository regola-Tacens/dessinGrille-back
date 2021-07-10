const { User } = require('../models');
const {Artworks} = require('../models');
const bcrypt = require('bcryptjs')
const { UserInputError } = require('apollo-server');
const artworks = require('../models/artworks');

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
    Mutation: {

      saveArtwork: async(parent, args, context, info) => {
          let { author, name, linenumber, pixelnumber, pixels} = args

          try {

            // TODO : create artwork
             const artwork = await Artworks.create({
                author, name, linenumber, pixelnumber, pixels
             })
             return artwork

          } catch (error) {
            console.log(error)
            throw error
          }
          
      },
      register: async (parent, args, context, info)=> {
        let { username,email,password,confirmPassword } = args
        let errors = {}

        try{

          // TODO : Validate input data
          if(email.trim() === '') errors.email = 'L\'email ne doit pas être vide';
          if(username.trim() === '') errors.username = 'Le champ user name ne doit pas être vide';
          if(password.trim() === '') errors.password = 'Le champ mot de passe ne doit pas être vide';
          if(confirmPassword.trim() === '') errors.confirmPassword = 'Le champ confirmer mot de passe ne doit pas être vide';

          // TODO : check if usernam / email exists
          const userByUsername = await User.findOne({ where: {username : username} })
          const userByUserEmail = await User.findOne({ where: {email : email} })

          if(userByUserEmail) errors.email = 'Cet email est déjà utilisé';
          if(userByUsername) errors.username = 'ce nom d\'utilisateur est déjà pris';

          // TODO : check if passwrod and confirm password match
          if(password !== confirmPassword) errors.confirmPassword = 'vous n\'avez pas saisi le même mot de passe' 

          if(Object.keys(errors).length > 0){
            throw errors
          }

          // TODO : hash password
          password = await bcrypt.hash(password, 6);

          // TODO : Create user
         const user =  await User.create({
            username, email, password
          })

          // TODO : Return user to Client
          return user

        } catch(error) {
           console.log(error)
           throw new UserInputError('Mauvaise saisie', {errors : error})
        }
      }
    }
  
  };