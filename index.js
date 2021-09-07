const { ApolloServer, gql } = require('apollo-server-express');
// const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

const router = require('./router');

const { sequelize } = require('./models');
const express = require('express');
// const http =require('http');


const typeDefs = require ('./graphQl/typeDefs');
const resolvers = require ('./graphQl/resolvers');

const app = express();
// const httpServer = http.createServer(app);

app.use(express.static('public'));

app.set('view engine', 'ejs' );
app.set('views', 'public/views');
app.use(router);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (ctx) => ctx
});

server.applyMiddleware({ app });


app.listen({ port: 4000 }, () =>{
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    sequelize
        .authenticate()
        .then(()=> console.log('database connceted!'))
        .catch((err) => console.log(err));
}
);

// app.listen().then(({ url }) => {
//     console.log(`🚀 Server ready at ${url}`);

//     sequelize
//         .authenticate()
//         .then(()=> console.log('database connceted!'))
//         .catch((err) => console.log(err));
// });

///////////////////////////////
// const express = require('express');
// const { ApolloServer, gql } = require('apollo-server-express');

// // Construct a schema, using GraphQL schema language
// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;

// // Provide resolver functions for your schema fields
// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//   },
// };

// const server = new ApolloServer({ typeDefs, resolvers });

// const app = express();
// server.applyMiddleware({ app });

// app.listen({ port: 4000 }, () =>
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
// );