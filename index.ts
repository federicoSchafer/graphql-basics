import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { v1 as uuid} from "uuid"
import { GraphQLError } from "graphql"

const users = [
    {
        id: 1,
        name: "Fede",
        surname: "Schafer",
        street: "El payaso",
        zipCode: 20020,
        city: "New York",
        phone: "+541110003232"
    },
    {
        id: 2,
        name: "Mica",
        surname: "Schafer",
        street: "El payaso",
        zipCode: 21020,
        city: "New York",
        phone: "+541112203232"
    },
]

// Los decoradores son @deprecated @skip @included
// Si queremos hacer uno personalizado, entonces se escribe directive @uppercase on FIELD_DEFINITION
const typeDefs = `
    type User {
        id: ID!
        name: String!
        surname: String!
        zipCode: Int!
        city: String!
        phone: String
        address: String
    }

    type Query {
        allUsers: [User]
        userCount: Int! @deprecate(reason: "use userLenght")
        userLenght: Int!
        findUserByName(name:String!): User
        findUserById(id:ID!): User
    }

    type Mutation {
        addUser(
            name: String!
            surname: String!
            street: String!
            zipCode: Int!
            phone: String
            city: String!
        ): User
    }
`

const resolvers = {
    User: {
        address: (parent) => `${parent.street}, ${parent.zipCode}, ${parent.city}`
    },
    Query: {
        allUsers: () => users,
        userCount: () => users.length,
        userLenght: () => users.length,
        findUserByName: (parent, args) => users.find( user => user.name === args.name),
        findUserById: (parent, args) => users.find( user => user.id === args.id)
    },
    Mutation: {
        addUser: (parrent, args) => {
            if(users.find( user => user.name === args.name)){
                throw new GraphQLError('The user already exists.',{
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }
            const user = {...args, id: uuid()}
            users.push(user)
            return user
        }
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