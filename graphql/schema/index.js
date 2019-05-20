const { buildSchema } = require("graphql");

module.exports = buildSchema(`
        type Booking {
            _id: ID!
            event: Event!
            user: User!
            createdAt: String!
            updatedAt: String!
        }
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            eventImg: String
            user: User!
            eventLocation: String!     
            comments: [Comment]       
        }

        type User {
            _id: ID!
            email: String!
            username: String!
            password: String!
            profilePic: String
            bio: String
            joined: String!
            bookedEvents: [Booking]
            createdEvents: [Event!]
        }

        type AuthData {
            userId: ID!
            username: String!
            token: String!
            tokenExp: Int! 
        }

        type Comment {
            _id: ID!
            user: User!
            text: String!
            date: String!
        }
        input UserInput {
            email: String!
            username: String!
            password: String!
            profilePic: String
            bio: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
            eventImg: String
            eventLocation: String!
        }

       
        type RootQuery {
            events: [Event!]!
            getEvent(eventId: ID!): Event!
            bookings: [Booking!]!
            login(email: String!, password: String!): AuthData!
            getUser(userId: ID!):User!
            getAuthUser: User!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            commentEvent(eventId: ID!, text: String!, date: String!): Event
            createUser(userInput: UserInput): User
            editProfile(bio: String!, profilePic: String!): User
            bookEvent(eventId: ID!): Booking!
            cancelBooking(bookingId: ID!): Event!
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
