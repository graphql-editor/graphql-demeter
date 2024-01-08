import { createServer, Server, IncomingMessage, ServerResponse } from 'node:http';
import { createSchema, createYoga } from 'graphql-yoga';
import { createFakeResolvers, FakerConfig } from 'graphql-demeter-core';

let mockServerCurrent: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

export const runMockServer = (schemaString: string, fakerConfig?: FakerConfig) => {
  // Same mocks object that `addMocksToSchema` takes above
  mockServerCurrent?.close();
  const resolvers = createFakeResolvers(schemaString, fakerConfig);
  const schema = createSchema({
    typeDefs: schemaString,
    resolvers,
  });
  // Create a Yoga instance with a GraphQL schema.
  const yoga = createYoga({ schema });
  // Pass it into a server to hook into request handlers.
  mockServerCurrent = createServer(yoga);
  // Start the server and you're done!
  mockServerCurrent.listen(4000, () => {
    console.info('Mock Server is running on http://localhost:4000/graphql');
  });
  return mockServerCurrent;
};
