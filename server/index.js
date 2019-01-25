import bodyParser from 'body-parser'
import passport from 'passport'
import oauth from 'passport-oauth'
import dotenv from 'dotenv'
import session from 'express-session'
import path from 'path'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import { ApolloServer, gql } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import schemaDirectives from './../src/api/directives'

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()
const typeDefs = gql`
  directive @isAuthenticated on QUERY | FIELD
  directive @rest(url: String) on FIELD_DEFINITION
  directive @hasScope(scope: [String]) on QUERY | FIELD

  type Article {
    id: ID!
    author: String
    title: String
    slug: String
    rating: Int @hasScope(scope: ["read:rating"])
  }
  type Comment {
    id: ID!
    author: String
    content: String
  }
  type CommentInput {
    author: String
    content: String
  }
  type Query {
    allArticles: [Article] @isAuthenticated
    _getArticle(id: ID!) @rest(url:"${process.env.REST_ENDPOINT}/api/article/")
    getArticle(id: ID): Article @isAuthenticated
  }
  type Mutation {
    addComment(input: CommentInput!): Comment @hasScope(scope: ["add:comment"])
  }
`

const resolvers = {
  Query: {
    async allArticles(_, args, context, info) {
      if (!context.user) throw new Error('Only users can eat cakes.')
      return []
    },
    async getArticle(_, { id }) {
      return []
    },
    async _getArticle(_,{ id }) {
      return []
    }
  },
  Mutation: {
    async addComment(_, args) {
      // TODO: add comment
    }
  }
}

passport.use(
  'oauth',
  new oauth.OAuth2Strategy(
    {
      tokenURL: `${process.env.OAUTH_PROVIDER}/oauth/token`,
      authorizationURL: `${process.env.OAUTH_PROVIDER}/oauth/authorize`,
      clientID: process.env.OAUTH_CONSUMER_KEY,
      clientSecret: process.env.OAUTH_CONSUMER_SECRET,
      callbackURL: process.env.OAUTH_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
      // TODO: Implement user fetch
      const user = 'Mike'
      done(null, user)
    }
  )
)
passport.serializeUser(function(user, done) {
  console.log(`SU: ${user}`)
  done(null, user)
})

passport.deserializeUser(function(id, done) {
  console.log(`DU: ${id}`)
  done(null, id)
})

app.use(express.local(path.resolve(__dirname, process.env.STATIC_DIR)))
app.use(bodyParser.urlEncoded({ extended: false }))
app.use(bodyParser.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_COOKIE_ID,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 10000
    },
    saveUninitialized: false,
    resave: false
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/login', passport.authenticate('oauth'))
app.get(process.env.OAUTH_CALLBACK_URL, (req, res, next) => {
  passport.authenticate('oauth', (err, user, info) => {
    if (user) res.status(200).json({ success: true, message: 'AUTHENTICATED' })
    res.status(401).json({ success: false, message: err.message })
  })(req, res, next)
})
/*
app.use('/api/graphql',
  graphqlHTTP((req, res) => {
    return new Promise((resolve, reject) => {
      const next = (user, info = {}) => {
        resolve({
          schema,
          graphiql: process.env.NODE_ENV !== 'production',
          context: {
            user: user || null
          }
        })
      }
      passport.authenticate('oauth', { session: false }, (err, user, info) => {
        next(user, info)
      })(req, res, next)
    })
  })
)
*/
app.use('/api/graphql', async (req, res, next) => {
  if(req.isAuthenticated) next()
  passport.authenticate('oauth', (err, user, info) => {
    if(user)
    req.login(user, err => { // Create session session
      next()
    }) else next()
  })(req, res, next)
})
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  debug: process.env.NODE_ENV === 'development',
  context: async ({ req, res }) => {
    return {
      user: req.user,
      isAuthenticated: req.isAuthenticated
    }
  }
})
apolloServer.applyMiddleware({
  app,
  path: '/api/graphql'
})
const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${server.address().port}`)
})
