import {Server} from "https://deno.land/std@0.166.0/http/server.ts";
import {GraphQLHTTP} from "https://deno.land/x/gql@1.1.2/mod.ts";
import {makeExecutableSchema} from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
import {resolvers} from "./resolvers.ts";
import {typeDefs} from "./typedefs.ts";

const schema = makeExecutableSchema({resolvers, typeDefs})

const server = new Server({
  handler: async (req) => {
    const {pathname} = new URL(req.url)

    return pathname === '/graphql'
      ? await GraphQLHTTP<Request>({
        schema,
        graphiql: true,
      })(req)
      : new Response("Not Found", {status: 404})
  },
  port: 3000,
})

console.log('Starting dinosearch at http://localhost:3000/graphql ...')
server.listenAndServe()