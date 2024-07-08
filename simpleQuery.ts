import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

//Origen de datos, traquilamente puede ser una BD o una API
const books = [
    {
        id: 1,
        title: 'titulo libro 1',
        author: 'Fede'
    },
    {
        id: 2,
        title: 'titulo libro 2',
        author: 'Mica'
    }
]

//Lista de querys que los clientes nos pueden enviar
//El '!' es campo obligatorio
const typeDefs = `
    type Book {
        id: ID!
        title: String
        author: String
    }
    type Query {
        books: [Book]
        book(id:ID!): Book
    }
`

//si es uno a uno con la clase books, no hace falta hacer ningun resolver
const resolvers = {
    Query: {
        books: () => books,
        book: (parent, args) => books.find((book) => book.id === parseInt(args.id))
    }
}

//Generamos una instancia de nuestro servidor apollo
const server = new ApolloServer({
    typeDefs,resolvers
})

//Levantar el servicio, 4000 por defecto donde levantar graphql
const { url } = await startStandaloneServer(server,{
    listen: { port: 4000}
})

console.log(`Server ready at: ${url} `)