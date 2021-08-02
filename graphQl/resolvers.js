const { User } = require('../models');
const {JWT_SECRET} = require('../config/env.json')
const {Artworks} = require('../models');
const bcrypt = require('bcryptjs')
const { UserInputError, AuthenticationError } = require('apollo-server');
const artworks = require('../models/artworks');
const jwt = require('jsonwebtoken');
const { Op } = require ('sequelize');

module.exports = {
    Query: {
      getUsers: async (parent,args,context) => { 
        try {  
          let user;
          if(context.req && context.req.headers.authorization){
            const token = context.req.headers.authorization.split('Bearer ')[1]
            jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
              if(err) {
                throw new AuthenticationError('non authentifié')
              }
              user = decodedToken;
            })
          }
            const users = await User.findAll({
              where :{ username :{ [Op.ne] : user.username} }
            })
            return users
        } catch (error) {
            console.log(error)
            throw error
        }
      },

      login: async(parent, args) => {
        const { username, password } = args;
        let errors ={}

        try {
          // on verifie que les champs username et password ne sont pas vides
          if (username.trim() === '') errors.username ='vous avez oublié de saisir le nom de l\'utilisateur'
          if (password === '') errors.password ='vous avez oublié de saisir le nom de passe'          
          if(Object.keys(errors).length > 0){
            throw new UserInputError('le champ est vide', { errors })
          }
          // on cherche dans la liste des emails si il existe un email qui corresponds.
          const user = await User.findOne({where : {username :username}});

          if(!user) {
            errors.email = ' cet utilisateur n\'existe pas';
            throw new UserInputError('l\' utilisateur n\'existe pas', { errors })
          }

          // on compare le mote de passe saisi au mot de passe enregistré.
          const correctPassword = await bcrypt.compare(password, user.password)
          if(!correctPassword) {
            errors.password = 'le mot de passe est faux';
            throw new AuthenticationError('mauvais mot de passe', { errors })
          }

          const token = jwt.sign(
            { username }
            ,JWT_SECRET,
            { expiresIn: 60 * 60});

            // user.token = token;

          return {
            ...user.toJSON(),
            createdAt: user.createdAt.toISOString(),
            token
          }

        } catch (error) {
          console.log(error)
          throw error
        }
      },
       getArtworks: async(parent,args,context) => {
         let errors={};
          try {
          let user;
          if(context.req && context.req.headers.authorization){   
            const token = context.req.headers.authorization.split('Bearer ')[1]
            jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
              if(err) {
                errors.auth='unauthentified';
                throw new AuthenticationError('non authentifié')
              }
              user = decodedToken;
              console.log('mon user est:', user)
            })
          }
          const artworked = await Artworks.findAll({
            where:{ author :{ [Op.eq] : user.username}}
          })
          return artworked

          } catch (error){
             console.log(error)
             throw error
          }        
      }
    },
    Mutation: {
      saveArtwork: async(parent, args, context, info) => {
          let { author, name, linenumber, pixelnumber, pixels} = args

          try {
            let user;
            if(context.req && context.req.headers.authorization){
              const token = context.req.headers.authorization.split('Bearer ')[1]
              jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
                if(err) {
                  // errors.auth="noAuth";
                  throw new AuthenticationError('non authentifié')
                }
                user = decodedToken;
              })
            }

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
      deleteArtwork: async(parent,args,context,info) => {
        let { name }  = args
        let errors = {}
        try {
          let user;
          if(context.req && context.req.headers.authorization){
            const token = context.req.headers.authorization.split('Bearer ')[1]
            jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
              if(err) {
                // errors.auth="noAuth";
                throw new AuthenticationError('non authentifié')
              }
              user = decodedToken;
            })
          }

          //check if artwork exists
          const selectedArtwork = await Artworks.findOne({ where: {name : name} })
          if(!selectedArtwork){
            throw new UserInputError('Ce nom de dessin n\'existe pas', { errors })
          } 
            
          await Artworks.destroy({
            where :{ name :{ [Op.eq] : name} }
          })
          
        }catch (error) {
          console.log(error);
          throw error;
        }

      },
      updateArtwork: async (parent,args,context,info) =>{
        let { author, name, linenumber, pixelnumber, pixels} = args

        try {
          let user;
          if(context.req && context.req.headers.authorization){
            const token = context.req.headers.authorization.split('Bearer ')[1]
            jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
              if(err) {
                // errors.auth="noAuth";
                throw new AuthenticationError('non authentifié')
              }
              user = decodedToken;
            })
          }
          //upatde artwork
          const artworkToPatch = await Artworks.findOne({Where :{author: author, name : name}})
          artworkToPatch.linenumber = linenumber;
          artworkToPatch.pixelnumber = pixelnumber;
          artworkToPatch.pixels = pixels;
          await artworkToPatch.save()
         return artworkToPatch

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
          if(username.trim() === '') errors.username = 'Il faut mettre un nom';
          if(password.trim() === '') errors.password = 'Il faut mettre un mot de passe';
          if(confirmPassword.trim() === '') errors.confirmPassword = 'Confirmez le mot de passe';

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

          // !!!!!!!!!!!!!!!CREATE A TOKEN, A CHANGER PEUT ETRE VOIR LE TUTO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          const token = jwt.sign(
            { username }
            ,JWT_SECRET,
            { expiresIn: 60 * 60});


          // TODO : Create user
         const user =  await User.create({
            username, email, password
          })

          // TODO : Return user to Client
          return {
            ...user.toJSON(),
            createdAt: user.createdAt.toISOString(),
            token
          }
          // return user

        } catch(error) {
           console.log(error)
           throw new UserInputError('Mauvaise saisie', {errors : error})
        }
      }
    }
  
  };